import { VentaData } from '@/components/pos/reports-view';

export interface IPrinterService {
    conectar(macAddress: string): Promise<boolean>;
    imprimirTicket(venta: VentaData): Promise<boolean>;
    desconectar(): Promise<void>;
}