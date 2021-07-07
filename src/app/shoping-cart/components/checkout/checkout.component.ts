﻿import { Component, OnInit } from '@angular/core';
import { ShopingCartService } from '../../services/shoping-cart.service';
import { GtagService } from '../../../services/gtag.service';


@Component({
    selector: 'checkout',
    templateUrl: './__mobile__/checkout.component.html',    
})
export class CheckoutComponent implements OnInit {

    constructor(
        private _shopingCartService: ShopingCartService,
        private _gtagService: GtagService,
    ) { }

    ngOnInit() {
        this._gtagService.sendRemarketingEventForCart();
        this._shopingCartService.logEnterToShopingCart();
    }
}