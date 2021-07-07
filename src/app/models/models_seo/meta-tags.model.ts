import { MetaTag } from './meta-tag.model';

export class MetaTags {
    public title: string = "";
    public metatags: Array<MetaTag> = new Array<MetaTag>();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}