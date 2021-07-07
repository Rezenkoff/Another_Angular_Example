import { MetaTags } from './meta-tags.model';

export class SeoPageModel {

    public pageUrl: string;
    public metaTags: MetaTags;
    public pageDescription: string;
    public pageExtId: number;
    public pageTypeId: number;
    public pageText: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

