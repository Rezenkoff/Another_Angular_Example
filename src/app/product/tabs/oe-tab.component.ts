import { Component, Input } from '@angular/core';
import { ProductDetail } from '../models/product-detail.model';

@Component({
    selector: 'oe-tab',
    templateUrl: './__mobile__/oe-tab.component.html',
    styleUrls: ['./__mobile__/styles/oe-tab.component__.scss']
})
export class OeTabComponent {
    @Input() productDetails: ProductDetail;

    public getOeCode(): any {
        return this.productDetails ? this.productDetails.oeCodeList : [];
    }
}