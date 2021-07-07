export class Language {
    public id: number;
    public name: string;
    public icon: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}