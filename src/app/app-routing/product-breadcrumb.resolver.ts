import { Injectable, Inject } from '@angular/core';
import { McBreadcrumbsResolver } from '../breadcrumbs/service/mc-breadcrumbs.resolver';
import { ProductInfoStorageService } from '../services/product-info-storage.service';
import { CatalogService } from '../services/catalog-model.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MainUrlParser, IUrlParser } from '../app-root/main-url.parser';
import { ServerParamsTransfer } from '../server-params-transfer.service';
import { CatalogType } from '../catalog/models/catalog-type.enum';
import { Observable, of } from 'rxjs';
import { IBreadcrumb } from '../breadcrumbs/mc-breadcrumbs.shared';
import { mergeMap, map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable()
export class ProductBreadcrumbsResolver extends McBreadcrumbsResolver {

    constructor(
        private serverParamsService: ServerParamsTransfer,
        @Inject(MainUrlParser) private urlParser: IUrlParser,
        private _catalogService: CatalogService,
        private _productStorageService: ProductInfoStorageService,
    ) { super(); }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const rawurl = route.params.urlEnding;
        const nodeId = this.urlParser.parseUrlForID(rawurl).category || 0;
       
        return this.getBredcrumbsForProduct(nodeId, this.serverParamsService.serverParams.isBotRequest);
    }

    private getBredcrumbsForProduct(nodeid: number, isbot: boolean): Observable<IBreadcrumb[]> {
        const catalogType = (isbot) ? CatalogType.Bot : CatalogType.Full;

        return this._productStorageService.getProductInfo().pipe(mergeMap(productInfo => {
            let categoryWithBrand: IBreadcrumb = this.getBrandFilterCrumb(productInfo, catalogType);
            return this._catalogService.loadNodeById(nodeid).pipe(
                map(node  => {
                    let crumbs = this.getNodeCrumbs(node, catalogType, categoryWithBrand);
                    return crumbs;
                }));
        }));
    }

    private getBrandFilterCrumb(productInfo: Product, catalogType: CatalogType): IBreadcrumb {
        let categoryWithBrand: IBreadcrumb = null;

        if (productInfo && productInfo.brandFilterUrl) {
            let categoryName = '';
            if (productInfo.categoryName) {
                categoryName = productInfo.categoryName;
            } else {
                const node = this._catalogService.getNodeById(productInfo.category, catalogType);
                categoryName = (node) ? node.name : '';
            }

            categoryWithBrand = { path: productInfo.brandFilterUrl, text: categoryName + ' ' + productInfo.brand };
        }

        return categoryWithBrand;
    }

    private getNodeCrumbs(node: any, catalogType: CatalogType, categoryWithBrand: IBreadcrumb): IBreadcrumb[] {
      
        if (!node)
            return [];

        let crumbs = [...node.breadcrumbs];

        if (categoryWithBrand) {
            categoryWithBrand.path = crumbs[crumbs.length - 1].path + "/" + categoryWithBrand.path;
            crumbs.push(categoryWithBrand);
        }

        crumbs.push({ text: '', path: '' });

        return crumbs;
    }

}