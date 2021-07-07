import { Language } from ".";

export class TextArticle  {
    public id: number;
    public languageId: number;
    public language: Language;
    public header: string;
    public description: string;
    public content: string;
    public publicationDate: Date;
    public previewPictureUrl: string = "";
    public active: boolean;
    public pageUrl: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}