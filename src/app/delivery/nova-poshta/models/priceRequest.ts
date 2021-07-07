export class PriceRequest {
    public cityRefSender:string;
    public cityRefRecipient: string;
    public cost: number;
    public weight: number;
    public seatsAmount: number = 1;
}