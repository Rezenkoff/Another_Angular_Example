export class UserPassport {
    series: string;
    number: string;
    issuedBy: string;
    whenIssued: string;

    constructor() {
        this.series = '';
        this.number = '';
        this.issuedBy = '';
        this.whenIssued = '';
    }
}