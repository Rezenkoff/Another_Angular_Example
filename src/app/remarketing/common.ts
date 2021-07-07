import { MainUrlParser } from '../app-root/main-url.parser';
import { CatalogService } from '../services/catalog-model.service';
import { Inject, Injectable } from '@angular/core';
import { Node } from '../catalog/models/node.model';
import { CatalogType } from '../catalog/models/catalog-type.enum';

@Injectable()
export class Common {

    constructor(
        @Inject(MainUrlParser) private urlParser: MainUrlParser,
        public _catalogService: CatalogService) {
    }

    public getCategoryId(productUrl: string): number {
        return this.urlParser.parseUrlForCategoryId(productUrl);
    }

    public getCurrentNode(id: number): Node {
        return new Node(this._catalogService.getNodeById(id, CatalogType.Full));
    }
}