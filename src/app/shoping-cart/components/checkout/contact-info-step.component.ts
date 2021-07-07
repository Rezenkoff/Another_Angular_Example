import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, OnInit } from "@angular/core";
import { Observable, of, BehaviorSubject, Subject } from "rxjs";
import * as fromShopingCart from '../../../shoping-cart/reducers';
import { Store } from '@ngrx/store';
import { StepsNamesEnum } from "../../models/steps-names.enum";
import { MainUserInfoModel } from "../../../order-user-info/models/main-user-info.model";
import { UserService } from "../../../services/user.service";
import { CurrentUser } from "../../../auth/models/current-user.model";
import * as fromOrderUserInfo from '../../../order-user-info/reducer';
import * as orderUserInfo from '../../../order-user-info/actions/order-user-info.actions';
import { takeUntil } from "rxjs/operators";
import { GtagService } from "../../../services/gtag.service";

@Component({
    selector: 'contact-info-step',
    templateUrl: './__mobile__/contact-info-step.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactInfoStepComponent implements OnInit, OnDestroy {

    @Input() enabledStep$: Observable<StepsNamesEnum> = new Observable<StepsNamesEnum>();
    @Output() contactInfoSubmit: EventEmitter<MainUserInfoModel> = new EventEmitter<MainUserInfoModel>();
    @Output() contactInfoEdit: EventEmitter<void> = new EventEmitter<void>();
    public isActive$: Observable<boolean> = new Observable<boolean>();
    public userInfo$: BehaviorSubject<CurrentUser> = new BehaviorSubject<CurrentUser>(null);
    public isAuthorized$: Observable<boolean> = new Observable<boolean>();
    public contactInfoActive: boolean = true;
    public authActive: boolean = false;
    private _userData: MainUserInfoModel = null;
    private _infoIsValid: boolean = false;
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    private _personalInfoSetEventSent: boolean = false;
    private _userAuthorized: boolean = false;

    public ordersListEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public contactInfoEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private shopingCartStore: Store<fromShopingCart.State>,
        private orderInfoStore: Store<fromOrderUserInfo.State>,
        private _userService: UserService,
        private _gtagService: GtagService,
        private _cd: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.enabledStep$.subscribe(step => {
            const enabled = (step == StepsNamesEnum.ContactInfo);
            this.isActive$ = of(enabled);
        });

        this.isAuthorized$ = this.shopingCartStore.select(fromShopingCart.getIsAuthorized);
        this.isAuthorized$.pipe(takeUntil(this._destroy$)).subscribe(authorized => this._userAuthorized = authorized);

        let user = this._userService.getCurrentUser();
        user.phone = (user.phone && user.phone.length == 13) ? user.phone.substring(3, 13) : user.phone;
        this.userInfo$.next(user);

        this.isActive$.pipe(takeUntil(this._destroy$)).subscribe(active => {
            if (!active) {
                this.ordersListEnabled$.next(false);
                this.contactInfoEnabled$.next(false);
                return;
            }
            this.contactInfoEnabled$.next(true);
        });
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    public showContactInfo(): void {
        this.authActive = false;
        this.contactInfoActive = true;
    }

    public showAuthorization(): void {
        this.contactInfoActive = false;
        this.authActive = true;
    }

    public setUser(user: CurrentUser): void {
        user.phone = (user.phone && user.phone.length == 13) ? user.phone.substring(3, 13) : user.phone;
        this.userInfo$.next(user);
    }

    public updateUserInfo(userData: MainUserInfoModel): void {
        this._userService.updateUserInfo(userData);
        this._userData = userData;
        this._infoIsValid = userData.isValid;
        this._cd.detectChanges();

        if (userData.isValid && !this._personalInfoSetEventSent) {
            this._personalInfoSetEventSent = true;
            this._gtagService.progressCheckout.sendCheckoutProgressAfterUserInfoChange(null);
        }
    }

    public submitEnabled(): boolean {
        return this._infoIsValid;
    }

    public submit(): void {
        this.orderInfoStore.dispatch(new orderUserInfo.SetUserInfo(this._userData));
        this.contactInfoSubmit.emit(this._userData);
        this.ordersListEnabled$.next(false);
        this.contactInfoEnabled$.next(false);
    }

    public editContactInfo(): void {
        this.contactInfoEdit.emit();
    }

    public activateUserInfo(): void {
        this.ordersListEnabled$.next(false);
        this.contactInfoEnabled$.next(true);
    }

    public processInputClick(): void {
        if (!this._personalInfoSetEventSent && !this._userAuthorized) {
            this._personalInfoSetEventSent = true;
            this._gtagService.progressCheckout.sendCheckoutProgressAfterUserInfoChange(null);
        }
    }
}