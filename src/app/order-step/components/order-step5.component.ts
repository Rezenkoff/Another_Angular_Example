import { Component, Inject, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from '../../shared/validators/email.validator';
import { OrderStepBaseComponent } from './order-step-base.component';
import { AuthHttpService } from '../../auth/auth-http.service';
import { OrderStepService } from '../order-step.service';
import { LastInfoService } from '../last-info.service';
import { UserStorageService } from '../../services/user-storage.service';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { OrderOfferService } from '../order-offer.service';

@Component({
    templateUrl: './__mobile__/order-step5.component.html'
})

export class OrderStepComponent5 implements OrderStepBaseComponent, OnInit, AfterViewInit {
    public isValid: boolean;
    public orderContactInfoGroup: FormGroup;
    @Output() change: EventEmitter<any> = new EventEmitter<any>();

    public mask = this._constants.PATTERNS.PHONE_MASK;

    constructor( @Inject(APP_CONSTANTS) public _constants: IAppConstants,
        private _orderOfferService: OrderOfferService,
        public orderStepService: OrderStepService,
        private fb: FormBuilder,
        private _authService: AuthHttpService,
        private _lastinfo: LastInfoService,
        private _localStorage: UserStorageService,
    ) {

        this.orderContactInfoGroup = this.fb.group({
            name: new FormControl('', Validators.compose([Validators.required])),
            email: new FormControl('', Validators.compose([CustomValidators.emailValidator])),
            phone: new FormControl('', Validators.compose([CustomValidators.phoneValidator]))
        });

    }

    ngOnInit() {
        if (this._authService.isAuthenticated()) {
            let user = this._localStorage.getUser();
            this.orderStepService.OrderStepMainModel.ContactInfo.FirstLastName = user.name;
            this.orderStepService.OrderStepMainModel.ContactInfo.Email = user.email;
            this.orderStepService.OrderStepMainModel.ContactInfo.Phone = user.phone.slice(3);

            this._orderOfferService.swapAgreementWithRegistredUser();
        }
        else {
            this._lastinfo.getLastUserInfo();
        }
        
        this.orderContactInfoGroup.valueChanges.subscribe(data => {
            this.orderStepService.OrderStepMainModel.ContactInfo.FirstLastName = data.name;
            this.orderStepService.OrderStepMainModel.ContactInfo.Email = data.email;
            this.orderStepService.OrderStepMainModel.ContactInfo.Phone = data.phone;
            this.orderStepService.OrderStepMainModel.ContactInfo.IsAgreed = true;

            if (!this._authService.isAuthenticated()) {
                this._lastinfo.rememberLastUserInfo();
            }

            this.isValid = this.orderContactInfoGroup.valid;

            this._orderOfferService.setAgreementStatus(this.orderStepService.OrderStepMainModel.ContactInfo.IsAgreed);
            this.change.emit(this.isValid);
        });

        this.orderStepService.OrderStepMainModel.ContactInfo.IsAgreed = this._orderOfferService.getAgreementStatusFromStorage();

        this.orderContactInfoGroup.reset({
            name: this.orderStepService.OrderStepMainModel.ContactInfo.FirstLastName,
            email: this.orderStepService.OrderStepMainModel.ContactInfo.Email,
            phone: this.orderStepService.OrderStepMainModel.ContactInfo.Phone,
        });

        if (this.orderContactInfoGroup.status === 'VALID') {
            this.isValid = this.orderContactInfoGroup.valid;
            this._orderOfferService.setAgreementStatus(this.orderStepService.OrderStepMainModel.ContactInfo.IsAgreed);
            this.change.emit(this.isValid);
        }
    }
    
    public ngAfterViewInit(): void {
        if (this._authService.isAuthenticatedAndAgreed()) {
            setTimeout(() => this.change.emit(true));
        }
    }

    public onCommentEdit(value: string): void {

    }
}