import { IPrinterService } from './IPrinterService';
import { BLEPrinter } from 'react-native-thermal-receipt-printer';
import { VentaData } from '@/components/pos/reports-view';

export class CatPrinterService implements IPrinterService {

    // Necesitamos inicializar el módulo de Bluetooth la primera vez
    private isInitialized = false;

    async conectar(macAddress: string): Promise<boolean> {
        try {
            if (!this.isInitialized) {
                await BLEPrinter.init(); // Prepara el Bluetooth del teléfono
                this.isInitialized = true;
            }

            // Se conecta vía Bluetooth a la MAC Address de la impresora
            await BLEPrinter.connectPrinter(macAddress);
            return true;
        } catch (error) {
            console.error("Error conectando a la impresora:", error);
            return false;
        }
    }

    async imprimirTicket(venta: VentaData): Promise<boolean> {
        try {
            const fecha = new Date().toLocaleString();

            BLEPrinter.printText('\x1B\x61\x01'); // Centrar texto
            BLEPrinter.printText('MENU MASTER\n');
            BLEPrinter.printText('--------------------------------\n');

            BLEPrinter.printText('\x1B\x61\x00'); // Alinear a la izquierda
            BLEPrinter.printText(`Fecha: ${fecha}\n`);
            BLEPrinter.printText(`Mesa: ${venta.numero_mesa || 'N/A'} | Mesero: ${venta.nombre_mesero || 'N/A'}\n`);
            BLEPrinter.printText('--------------------------------\n');

            // Iterar sobre los productos
            const productos = venta.productos_cobrados || venta.productos || [];
            productos.forEach(p => {
                const cant = p.cantidad || 1;
                const nombre = p.nombre || 'Item';
                const sub = p.subtotal || (cant * (p.precio || 0));

                // Formatear para que se vea alineado
                BLEPrinter.printText(`${cant}x ${nombre}\n`);
                BLEPrinter.printText(`   $${sub.toFixed(2)}\n`);
            });

            BLEPrinter.printText('--------------------------------\n');
            BLEPrinter.printText('\x1B\x61\x02'); // Alinear a la derecha
            BLEPrinter.printText(`TOTAL: $${venta.total?.toFixed(2)}\n`);

            BLEPrinter.printText('\x1B\x61\x01'); // Centrar texto
            BLEPrinter.printText('\n¡Gracias por su preferencia!\n\n\n');

            return true;
        } catch (error) {
            console.error("Error imprimiendo:", error);
            return false;
        }
    }

    async desconectar(): Promise<void> {
        try {
            await BLEPrinter.closeConn();
        } catch (error) {
            console.error("Error desconectando:", error);
        }
    }
}

// Instancia global o inyectada
export const printerService = new CatPrinterService();