export class RedirectPage {
    id: string;
    from: string;
    to: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}