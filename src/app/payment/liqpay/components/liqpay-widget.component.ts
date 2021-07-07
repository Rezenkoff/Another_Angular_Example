import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScriptService } from '../../../lazyloading/script.service';
import { LiqpayService } from '../liqpay.service';
declare var LiqPayCheckout: any;

@Component({
    selector: 'liqpay-widget',
    template: '<div id="liqpay_checkout"></div>'
})
export class LiqpayWidgetComponent implements OnInit {
    constructor(@Inject(PLATFORM_ID) private platformId, private _scripts: ScriptService, private _liqpay: LiqpayService) { }

    public ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this._scripts.load('liqpay_checkout').then(data => {
                this._liqpay.LiqPayCheckout = LiqPayCheckout;
            });
        }
    }
}

