import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CartProduct } from '../models/shoping-cart-product.model';
import { NavigationService } from '../../services/navigation.service';

@Component({
    selector: 'product-preview',
    templateUrl: './__mobile__/product-preview.component.html'
})
export class ProductPreviewComponent {
    @Input() product: CartProduct;
    @Output() remove = new EventEmitter<CartProduct>();
    @Output() increment = new EventEmitter<CartProduct>();
    @Output() decrement = new EventEmitter<CartProduct>();
    @Output() update = new EventEmitter<any>();

    constructor(
        private _navigationService: NavigationService
    ) { }

    get getImageUrl(): string {
        if (this.product.image)
            return 'data:image/jpeg;base64,' + this.product.image;

        return '';
    }

    get id() {
        return this.product.id;
    }

    get brand() {
        return this.product.brand;
    }

    get price() {
        return this.product.price;
    }

    get quantity() {
        return this.product.quantity;
    }

    get articleId() {
        return this.product.articleId;
    }

    get transletiratedTitle() {
        return this.product.transletiratedTitle;
    }

    get lookupNumber() {
        return this.product.lookupNumber;
    }

    get displayDescription() {
        return this.product.displayDescription;
    }

    public isDisabled(): string {
        if (this.quantity == this.product.incDecStep)
            return 'disabled-button';

        return '';
    }

    public navigateToProduct() {       
        if (!this.product.transletiratedTitle) {
            return;
        }
        let title = this.product.transletiratedTitle;
        if (title.endsWith(".html")) {
            title = title.substring(0, title.indexOf(".html"));
        }        
        this._navigationService.OpenProductInNewTab(title);        
    }

}
