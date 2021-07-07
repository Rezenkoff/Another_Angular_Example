import { Component, OnInit, Inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { BaseBlockComponent } from '../../shared/abstraction/base-block.component';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { AuthHttpService } from '../../auth/auth-http.service';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {  share } from 'rxjs/operators';
import * as shopingcart from '../../shoping-cart/actions/shoping-cart';
import * as fromShopingCart from '../../shoping-cart/reducers';
import { GtagService } from '../../services/gtag.service';


@Component({
    selector: 'auto-doc-basket',
    templateUrl: './__mobile__/basket.component.html'
})
export class BasketComponent extends BaseBlockComponent implements OnInit, OnDestroy {

    @ViewChild('basket') public basketRef: ElementRef; 
    @ViewChild('basketadded') public basketaddedRef: ElementRef;

    private totalItemsSubscription: Subscription = new Subscription();
    private totalItems$: Observable<number>;
    private userLogedInSubscription: Subscription = new Subscription();
    public totalItems: number;

    constructor(private store: Store<fromShopingCart.State>, @Inject(APP_CONSTANTS) constants: IAppConstants, private _authService: AuthHttpService,
                private _gtagService: GtagService) {
        super(constants);
        this.totalItems$ = store.select(fromShopingCart.getTotalItems).pipe(share());        
    }

    public ngOnInit(): void {
        this.store.dispatch(new shopingcart.LoadAction());        
                
        this.userLogedInSubscription = this._authService.userLogedIn.subscribe(isLogedIn => {
            this.store.dispatch(new shopingcart.ConcatBasket());           
        });

        this.totalItemsSubscription = this.totalItems$.subscribe(totalItems => {
            this.totalItems = totalItems;
        });
    }

    public ngOnDestroy(): void {        
        this.userLogedInSubscription.unsubscribe();
        this.totalItemsSubscription.unsubscribe();       
    }

    public clickCheckout() {
        this.toggleWindow();
        this._gtagService.beginCheckout.sendCheckout(null);
        this._gtagService.progressCheckout.sendCheckoutProgressAfterCartOpen(null);      
    }
}
