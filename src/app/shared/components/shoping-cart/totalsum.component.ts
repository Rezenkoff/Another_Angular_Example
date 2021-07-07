import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromShopingCart from '../../../shoping-cart/reducers';

@Component({
    selector: 'total-sum',
    templateUrl: './__mobile__/totalsum.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalSumComponent implements OnDestroy, OnInit {
    public totalSum$: Observable<number>;
    private totalSubscription: Subscription = new Subscription();
    public totalSum: number;

    constructor(private store: Store<fromShopingCart.State>, private cd: ChangeDetectorRef) {
        this.totalSum$ = store.select(fromShopingCart.getTotalCartSum);
    }

    ngOnInit(): void {
        this.totalSubscription = this.totalSum$.subscribe(data => {
            this.totalSum = data;
            this.cd.markForCheck();
        });
    }
    ngOnDestroy(): void {
        this.totalSubscription.unsubscribe();
    }

}
