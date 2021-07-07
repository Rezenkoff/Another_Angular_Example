export class MetaTag {
    public name: string = "";
    public content: string = "";

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}