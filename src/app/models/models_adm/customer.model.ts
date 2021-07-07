export class Contractor{
    id: string;
    description: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}