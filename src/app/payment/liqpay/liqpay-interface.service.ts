
export interface ILiqpayService {
    onLiqpayCallback(data: any): void;
    onLiqpayClose(data: any): void;
    onLiqpayReady(data: any): void;
    initCheckout(data: any, phone: string): void;
}