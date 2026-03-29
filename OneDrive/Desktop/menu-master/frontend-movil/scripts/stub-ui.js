const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, '../src/components/ui');
const files = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx'));

const keepUnchanged = ['button.tsx', 'card.tsx', 'badge.tsx', 'avatar.tsx', 'label.tsx', 'switch.tsx', 'input.tsx', 'scroll-area.tsx', 'toast.tsx', 'toaster.tsx'];

files.forEach(file => {
  if (keepUnchanged.includes(file)) return;
  
  const filePath = path.join(uiDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Detect exported members (e.g., export { Accordion, AccordionItem... } or export const Accordion)
  const exportMatches = [...content.matchAll(/export\s+\{\s*([^}]+)\s*\}/g)];
  const constMatches = [...content.matchAll(/export\s+(?:const|function)\s+([A-Z][a-zA-Z0-9_]*)/g)];

  let exportsList = [];
  
  exportMatches.forEach(match => {
    const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0]).filter(n => n && !n.includes('type '));
    exportsList.push(...names);
  });
  
  constMatches.forEach(match => {
    exportsList.push(match[1]);
  });

  exportsList = [...new Set(exportsList)].filter(name => name !== 'cn' && !name.toLowerCase().includes('props'));

  if (exportsList.length > 0) {
    let newContent = `import * as React from "react";\nimport { View, Text } from "react-native";\nimport { cn } from "@/lib/utils";\n\n`;
    
    exportsList.forEach(comp => {
      newContent += `const ${comp} = React.forwardRef<any, any>(({ className, ...props }, ref) => (\n  <View ref={ref as any} className={cn("", className)} {...props} />\n));\n${comp}.displayName = "${comp}";\n\n`;
    });
    
    newContent += `export {\n  ${exportsList.join(',\n  ')}\n};\n`;
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Stubbed ${file} with exports: ${exportsList.join(', ')}`);
  } else {
    // Just wrap in View fallback if we can't find specific exports
    console.log(`Could not automatically stub ${file}`);
  }
});
