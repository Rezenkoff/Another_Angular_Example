import { Language } from ".";

export class News {
    public id: number;
    public language: Language;
    public header: string;
    public ukrHeader: string;
    public description: string;
    public ukrDescription: string;
    public content: string;
    public ukrContent: string;
    public publicationDate: Date;
    public previewPictureUrl: string = "";
    public previewPictureUrlUkr: string = "";
    public active: boolean;
    public pageUrl: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}