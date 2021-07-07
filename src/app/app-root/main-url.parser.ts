import { Injectable } from '@angular/core';
import { Filter } from '../search/models/filter.model';

export interface IUrlParser {
    parseUrlForID(url: string): TypeExt;
}

@Injectable()
export class MainUrlParser {
    private urlSplitter: string = '-id';
    private urlSplitterT: string = '-';
    private filterUrlSplitter: string = '--';

    public parseUrlForID(productUrl: string): TypeExt {
        //default 0 id for /category main page
        if (!productUrl)
            return { id: 0, type: 0, category: -1 };

        let ids = productUrl.match(/id([\-\d+]+)$/);
        let arr = ids[1].split(this.urlSplitterT);

        let pageId = 0;
        let type = 0;
        let category = -1;

        switch (arr.length) {
            case 2:
                pageId = +arr[0];
                type = +arr[1];
                break;
            case 3:
                pageId = +arr[0];
                type = +arr[1];
                category = +arr[2];
                break;
            case 4:
                let signedfirst = !!!arr[0];
                pageId = signedfirst ? +(-arr[1]) : +arr[0];
                type = signedfirst ? +arr[2] : +arr[1];
                category = !signedfirst ? +(-arr[3]) : +arr[3];
                break;
            case 5:
                pageId = -arr[1];
                type = +arr[2];
                break;
        }

        return { id: pageId, type: type, category: category };
    }

    public parseUrlForFilterParameters(filterUrl: string): any

    // Filter 
    {
        if (!filterUrl) {
            return null;
        }
        let arr: string[] = filterUrl.split(this.filterUrlSplitter);
        if (arr.length < 2) {
            return null;
        }
        let keyStr = arr[0];
        let type = arr[1];
        let filter: Filter = { key: keyStr, type: Number(type), value: '' };
        return filter;
    }

    public parseUrlForCategoryId(productUrl: string): number {
        if (!productUrl) {
            return 0;
        }
        let startIdx = productUrl.lastIndexOf(this.urlSplitterT) + 1;
        let endIdx = productUrl.length;
        return Number.parseInt(productUrl.substring(startIdx, endIdx));
    }
}
export class TypeExt {
    public id: number;
    public type: number;
    public category?: number;
}