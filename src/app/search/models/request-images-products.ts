
export class RequestImagesForProducts {
    public articles: number[];
    public icoType: number;

    constructor(icoType: number) {
        this.articles = [];
        this.icoType = icoType;
    }
}

