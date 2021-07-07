import { Component, OnInit, ChangeDetectionStrategy,  } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromShopingCart from '../../../shoping-cart/reducers';

@Component({
    selector: 'total-items',
    templateUrl: './__mobile__/totalitems.component.html'
})
export class TotalItemsComponent implements OnInit {
    public totalItems$: Observable<number>;
    public form: number = 0;

    constructor(
        private store: Store<fromShopingCart.State>,
    ) {
    }

    ngOnInit(): void {
        this.totalItems$ = this.store.select(fromShopingCart.getTotalItems);
        this.totalItems$.subscribe(total => {
            this.setPluralForm(total);
        });
    }

    private setPluralForm(total: number): void {
        const divideRest: number = total % 10;
        if (divideRest == 1) {
            this.form = 2;
        } else if (divideRest >= 2 && divideRest <= 4) {
            this.form = 1;
        } else {
            this.form = 0;
        }
    }    
}
