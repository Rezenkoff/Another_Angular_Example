import { AlertService } from "../../services/alert.service";
import { UserService } from "../../services/user.service";
import { AuthErrorService } from "../../auth/auth-error.service";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { UserLogin } from "../../auth/models/user-login.model";
import { Store } from "@ngrx/store";
import * as shopingcart from '../../shoping-cart/actions/shoping-cart';
import * as fromShopingCart from '../../shoping-cart/reducers';
import { Injectable, EventEmitter } from "@angular/core";
import { CurrentUser } from "../../auth/models/current-user.model";

@Injectable()
export class CartAuthorizationService  {
    public userLogedIn: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(
        private _alertService: AlertService,
        private _authErrorService: AuthErrorService,
        private _userService: UserService,
        private store: Store<fromShopingCart.State>,
    ) { }

    public login(userLogin: UserLogin): Observable<CurrentUser> {
        return this._userService.login(userLogin).pipe(
            map(data => {
                let user = this._userService.mapToCurrentUserModel(data);
                this.store.dispatch(new shopingcart.SetUserInfo(user));
                this.userLogedIn.emit(true);
                return user;
            }), catchError(error => {
                let message = this._authErrorService.getErrorDescription(error);
                this._alertService.error(message);
                return of(null);
        }));
    }
}