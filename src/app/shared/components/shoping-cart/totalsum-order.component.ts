import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromShopingCart from '../../../shoping-cart/reducers';

@Component({
    selector: 'total-sum-order',
    templateUrl: './__mobile__/totalsum-order.component.html'
})
export class TotalSumOrderComponent implements OnDestroy, OnInit {
    public totalSum$: Observable<number>;
    private totalSubscription: Subscription = new Subscription();
    public totalSum: number;
    public coins: number; 

    constructor(
        private store: Store<fromShopingCart.State>
    ) {
        store.select(fromShopingCart.getTotalCartSumWithDiscount).subscribe(total => {
            this.totalSum = total;
            //const rest = (total % 1)
            //this.totalSum = Math.round(total - rest);
            //this.coins = Math.round(100 * rest);
        });        
    }

    ngOnInit(): void {
      
    }

    ngOnDestroy(): void {

    }
}
