export class PagedResponse<T extends Object> {
    public total: number;
    public data: T;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}