import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { DiscountService } from '../../services/discount.service';
import { AlertService } from '../../../services/alert.service';
import { LanguageService } from '../../../services/language.service';
import { IAlertTranslations, ALERT_TRANSLATIONS } from '../../../translate/custom/alert-translation';
import { DiscountModel } from '../../models/discount.model';
import * as shopingcart from '../../../shoping-cart/actions/shoping-cart';
import * as fromShopingCart from '../../../shoping-cart/reducers';

@Component({
    selector: 'discount',
    templateUrl: './__mobile__/discount.component.html',
    styleUrls: ['./__mobile__/styles/discount.component__.scss']
})
export class DiscountComponent {

    @Output() discount: EventEmitter<DiscountModel> = new EventEmitter<DiscountModel>();

    public discountDisplayed: boolean = false;
    public discountDisplayedAllBlock: boolean = true;
    public discountCode: string = "";

    constructor(private _discountService: DiscountService, private _alertService: AlertService,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        private _languageService: LanguageService,
        private store: Store<fromShopingCart.State>,) { }

    public toggleDiscountShowing() {
        this.discountDisplayed = !this.discountDisplayed;
    }

    public checkDiscount() {
        let language = this._languageService.getSelectedLanguage().name;
        if (this.discountCode.length < 4 || this.discountCode.length > 400) {
            let messageKey = "wrong_discount";
            let message = this._translations.ERRORS[`${messageKey}_${language}`];
            this._alertService.warn(message);
            this.setDiscount(null);
            return;
        }
        this._discountService.getDiscountByPromo(this.discountCode).subscribe((result:any) => {
            if (result.success) {
                let message = this._translations.SUCCESS[`discount_activated_${language}`];
                let discount = this.parseToDiscountModel(result.data);
                this._alertService.success(message);
                this.setDiscount(discount);
                this.discountDisplayedAllBlock = !this.discountDisplayedAllBlock;
            }
            else {
                let messageKey = result.data ? result.data : "default";
                let message = this._translations.ERRORS[`${messageKey}_${language}`];
                this._alertService.warn(message);
                this.setDiscount(null);
            }
        });
    }

    private parseToDiscountModel(data: any): DiscountModel {
        let result = new DiscountModel();
        result.promo = data.promo;
        result.size = data.size;
        result.typeDiscount = data.discountTypeId
        return result;
    }

    private setDiscount(discount: DiscountModel) {
        this.store.dispatch(new shopingcart.AddDiscount(discount));
        this.discount.emit(discount);
    }
}