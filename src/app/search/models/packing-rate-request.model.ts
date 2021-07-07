export class PackingRateRequest {
    listIds: string[];
    byCart: boolean;

    constructor() {
        this.byCart = true;
    }
}