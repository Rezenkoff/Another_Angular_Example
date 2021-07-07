export class Liqpay {
    paymentId: number;
    acqId: number;
    amount: number
    action: string;
    data: string;
    createDate: Date;
    endDate: Date;
    orderId: string;
    orderIdRaw: number;
    exPaymentId: number;
    isPaymentSuccess: boolean;
    signature: string;
    transactionId: number;
    currency: string
    exPaymentType: string;
    senderCardMask:string;
    senderCardType:string;
    senderCommission: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    
}