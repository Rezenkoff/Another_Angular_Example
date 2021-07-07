import { Injectable } from '@angular/core';
import { Product } from '../models';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ProductInfoStorageService {

    private _productInfo: Subject<Product> = new Subject<Product>();
    private _prevProductId: number = null;

    public saveProductInfo(product: Product): void {
        this._prevProductId = product.id;
        this._productInfo.next(product);
    }

    public getProductInfo(): Observable<Product> {
        return this._productInfo;
    }    
}