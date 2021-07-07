﻿import { Injectable, Inject } from '@angular/core';
import { MainUrlParser } from '../app-root/main-url.parser';
import { APP_CONSTANTS, IAppConstants } from '../config/app-constants';
import { Observable, of } from "rxjs";
import { map } from 'rxjs/operators';
import { CartProduct } from '../shoping-cart/models/shoping-cart-product.model';
import { CatalogService } from './catalog-model.service';

const LRU = require("lru-cache");

@Injectable()
export class CategoryInfoService {

    private _catalogSub: Observable<Object> = null;
    private cache: any = null;
    private cacheKey: string = 'categories_dict';

    constructor(       
        @Inject(APP_CONSTANTS)
        private _constants: IAppConstants,
        private _urlParser: MainUrlParser,
        private _catalogService: CatalogService,
    ) {
        var options = {
            max: this._constants.CACHE.SIZE,
            maxAge: this._constants.CACHE.MAX_AGE
        };
        this.cache = new LRU(options);
    }

    private getCategoryNameByUrl(url: string): Observable<string> {
        let parsed = this._urlParser.parseUrlForID(url);
        let nodeId = parsed.category;

        let cached = this.cache.get(this.cacheKey);
        if (cached) {
            return of<string>(cached[nodeId] || '');
        }

        return this.getCategoriesDict().pipe(            
            map(categories => {
                return categories[nodeId] || '';
            }))
    }

    public getCategoryNameByNodeId(nodeId: number): Observable<string> {
        let cached = this.cache.get(this.cacheKey);
        if (cached) {
            return of<string>(cached[nodeId] || '');
        }
        return this.getCategoriesDict().pipe(
            map(categories => {
                return categories[nodeId] || '';
            }));
    };

    public setProductCategories(products: CartProduct[]): Observable<void> {
        let cachedCategories = this.cache.get(this.cacheKey);
        if (!cachedCategories) {
            return this.getCategoriesDict().pipe(
                map(dict => {
                    cachedCategories = dict;
                    this.setCategories(products, cachedCategories);
                    return;
                }));
        }
        this.setCategories(products, cachedCategories);
        return of(null);
    }

    private setCategories(products: CartProduct[], cachedCategories: any): void {
        products.forEach(product => {
            let parsed = this._urlParser.parseUrlForID(product.transletiratedTitle);
            let nodeId = parsed.category;
            product.category = (cachedCategories && cachedCategories[nodeId]) ? cachedCategories[nodeId].name : '';
        });
    }

    private getCategoriesDict(): Observable<Object> {
        const dictionary = this._catalogService.getNodesDictionary();
        return of(dictionary);
    }

    private addChildrenToDictRecursively(node: any, categoriesDict: any) {
        categoriesDict[node.nodeId] = node.name;
        if (node.children) {
            node.children.forEach(childNode => this.addChildrenToDictRecursively(childNode, categoriesDict));
        }
    }
}