import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromShopingCart from '../../shoping-cart/reducers';
import * as shopingcart from '../../shoping-cart/actions/shoping-cart';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'checkout-suspended',
    templateUrl: './__mobile__/order-checkout-suspended.component.html'
})
export class OrderCheckoutSuspendedComponent implements OnInit, AfterViewInit {
    orderId: string = '';
    secretLinkCode: string = '';
    rtbHouseUrlForConfirmOrder: string = "";

    constructor(private route: ActivatedRoute,
        private store: Store<fromShopingCart.State>,
        private _sanitizer: DomSanitizer,
    ) {
        this.orderId = this.route.snapshot.params['orderId'];
        this.secretLinkCode = this.route.snapshot.params['orderSecretLinkCode'];
    }

    ngOnInit() {
        
    }

    ngAfterViewInit() {
        this.store.dispatch(new shopingcart.UnloadAction());
    }
}
