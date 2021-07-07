export class SMSRecoverData {
    public userId: number;
    public confirmCode: string;
    public codSended: boolean;
    constructor(        
    ) {
        this.userId = 0;
        this.confirmCode= "";
        this.codSended = false;
    }
}