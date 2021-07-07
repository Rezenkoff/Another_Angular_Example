import { Injectable } from "@angular/core";
import { Product } from "../models/product.model";

@Injectable()
export class SeoCommonService {
    public setSeoFriendlyTitle(product: Product): void {
        let suffix: string = '';
        let lookupNumber: string = '';
        let brand: string = '';

        if (product
            && product.displayDescription
            && product.lookupNumber
            && (!product.displayDescription.toLowerCase().includes(product.lookupNumber.toLowerCase()))
        ) {
            lookupNumber = ` ${product.lookupNumber}`;
        }

        if (product
            && product.displayDescription
            && product.brand
            && (!product.displayDescription.toLowerCase().includes(product.brand.toLowerCase()))
        ) {
            brand = ` ${product.brand}`;
        }

        if (lookupNumber || brand) {
            suffix = `.${lookupNumber}${brand}`;
            product.displayDescription = product.displayDescription.trim() + suffix;
        }
    }
}