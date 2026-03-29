'use server';
/**
 * @fileOverview A GenAI tool to assist admins in crafting creative, appealing, and keyword-rich descriptions for menu items.
 *
 * - generateMenuItemDescription - A function that handles the menu item description generation process.
 * - GenerateMenuItemDescriptionInput - The input type for the generateMenuItemDescription function.
 * - GenerateMenuItemDescriptionOutput - The return type for the generateMenuItemDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMenuItemDescriptionInputSchema = z.object({
  itemName: z.string().describe('The name of the menu item.'),
  ingredients: z.array(z.string()).describe('A list of key ingredients in the dish.'),
  dishType: z
    .string()
    .describe('The type of dish (e.g., appetizer, main course, dessert, beverage).'),
});
export type GenerateMenuItemDescriptionInput = z.infer<
  typeof GenerateMenuItemDescriptionInputSchema
>;

const GenerateMenuItemDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe('A creative, appealing, and keyword-rich description for the menu item.'),
});
export type GenerateMenuItemDescriptionOutput = z.infer<
  typeof GenerateMenuItemDescriptionOutputSchema
>;

export async function generateMenuItemDescription(
  input: GenerateMenuItemDescriptionInput
): Promise<GenerateMenuItemDescriptionOutput> {
  return generateMenuItemDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMenuItemDescriptionPrompt',
  input: {schema: GenerateMenuItemDescriptionInputSchema},
  output: {schema: GenerateMenuItemDescriptionOutputSchema},
  prompt: `You are an expert culinary marketer tasked with creating enticing menu descriptions for a restaurant.

Generate a creative, appealing, and keyword-rich description for the following menu item, ensuring it highlights the main ingredients and dish type.

Menu Item Name: {{{itemName}}}
Ingredients: {{#each ingredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Dish Type: {{{dishType}}}`,
});

const generateMenuItemDescriptionFlow = ai.defineFlow(
  {
    name: 'generateMenuItemDescriptionFlow',
    inputSchema: GenerateMenuItemDescriptionInputSchema,
    outputSchema: GenerateMenuItemDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
