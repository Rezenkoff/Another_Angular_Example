export class PaymentInfo {
    CardNumber: number;
    MFO: number;
    IPN: number;
    BankName: string = '';
    isPrivatBank: boolean = true;
    Comment: string = '';
}