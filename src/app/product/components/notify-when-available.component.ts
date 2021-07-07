import { Component, Inject } from '@angular/core';
import { BaseBlockComponent } from '../../shared/abstraction/base-block.component';
import { IAppConstants, APP_CONSTANTS } from '../../config';
import { Product } from '../../models/product.model';
import { AlertService } from '../../services/alert.service';
import { ProductService } from '../product.service';
import { AuthHttpService } from '../../auth/auth-http.service';

@Component({
    selector: 'notify-when-available',
    templateUrl: './__mobile__/notify-when-available.component.html'
})
export class NotifyWhenAvailableComponent extends BaseBlockComponent {

    public product: Product;
    public phoneOrEmail: string;
    public firstLastName: string;
    public isDisabledButton: boolean = false;

    private _emailRegEx = new RegExp(this._constants.PATTERNS.EMAIL_PATTERN);
    private _phoneRegEx = new RegExp(this._constants.PATTERNS.CALLBACK_PATTERN);

    constructor(private _alertService: AlertService, private _productService: ProductService,
        @Inject(APP_CONSTANTS) private _constants: IAppConstants, private _authService: AuthHttpService,) { super(_constants); }

    public addProductAndOpenWindow(product: Product) {
        this.product = product;
        this.isDisabledButton = (false);
        if (this._authService.isAuthenticated()) {
            this.setUserData();
        }
        this.toggleWindow();
    }

    public save() {
        this.isDisabledButton = (true);

        if (!this.firstLastName) {
            this._alertService.error("Вы не указали ФИО");
            this.isDisabledButton = (false);
            return;
        }

        let isEmail = this._emailRegEx.test(this.phoneOrEmail);
        let isPhone = this._phoneRegEx.test(this.phoneOrEmail);

        if (!isEmail && !isPhone) {
            this._alertService.error("Неверно указан телефон или Email");
            this.isDisabledButton = (false);
            return;
        }
        this._productService.saveNotifyWhenProductAvailableRequest(this.product.id, this.product.displayDescription,
            isPhone ? this.phoneOrEmail : null, isEmail ? this.phoneOrEmail : null, this.firstLastName).subscribe(result => {
                if (result.success) {
                    this.hideWindow();
                    this._alertService.success("Спасибо за обращение, Ваш запрос сохранен");
                }
                else {
                    this._alertService.warn("Произошла ошибка, попробуйте позже или обратитесь в поддержку");
                }
                this.isDisabledButton = (false);
            });
    }

    private setUserData() {
        let user = this._authService.getCurrentUser();
        if (user) {
            this.firstLastName = user.name;
            this.phoneOrEmail = '+38' + user.phone.substr(user.phone.length - 10);
        }
    }
}