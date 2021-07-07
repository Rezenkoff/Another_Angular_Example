import { Component, ElementRef, ViewChild, OnDestroy, Inject, EventEmitter, Output } from '@angular/core';
import { UserLogin } from '../../auth/models/user-login.model';
import { BaseLoader } from '../../shared/abstraction/loaderbase.component';
import { takeUntil, map, finalize } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { IAppConstants, APP_CONSTANTS } from '../../config/app-constants';
import { CartAuthorizationService } from '../services/cart-authorization.service';
import { Store } from '@ngrx/store';
import * as fromShopingCart from '../../shoping-cart/reducers/shoping-cart.reducer';
import * as shopingcart from '../../shoping-cart/actions/shoping-cart';
import { CurrentUser } from '../../auth/models/current-user.model';

@Component({
    selector: 'cart-authorization',
    templateUrl: './__mobile__/cart-authorization.component.html'
})
export class CartAuthorizationComponent extends BaseLoader implements OnDestroy 
{
    @Output() onAuthorization: EventEmitter<CurrentUser> = new EventEmitter<CurrentUser>();

    @ViewChild('password') passwordElement: ElementRef;
    public userLogin: UserLogin = new UserLogin("", "");
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private userLogedInSubscription: Subscription = new Subscription();

    constructor(
        @Inject(APP_CONSTANTS) public _constants: IAppConstants,
        private _cartAuthService: CartAuthorizationService,
        private store: Store<fromShopingCart.State>
    ) {
        super();  
    }

    ngOnInit() {
        this.userLogedInSubscription = this._cartAuthService.userLogedIn.subscribe(isLogedIn => {
            this.store.dispatch(new shopingcart.ConcatBasket());
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this.userLogedInSubscription.unsubscribe();
    }

    public checkLength() {
        if (this.userLogin.phone.length === 10) {
            this.passwordElement.nativeElement.focus();
        }
    }

    public login(): void {
        this.StartSpinning();
        this._cartAuthService.login(this.userLogin).pipe(takeUntil(this.destroy$),
            map((user) => {
                this.onAuthorization.emit(user);
            }, error => { }),
            finalize(() => this.EndSpinning())).subscribe();
    }

    public passwordIsValid(): boolean {
        return Boolean(this.userLogin && this.userLogin.password);
    }
}