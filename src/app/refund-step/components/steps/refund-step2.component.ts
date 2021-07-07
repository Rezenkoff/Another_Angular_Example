import { Component, Output, EventEmitter, Inject, ViewChild } from '@angular/core';
import { IRefundStep } from './refund-step.interface';
import { AuthHttpService } from '../../../auth/auth-http.service';
import { UserStorageService } from '../../../services/user-storage.service';
import { CurrentUser } from '../../../auth/models';
import { RefundStepService } from '../../refund-step.service';
import { Subscription } from 'rxjs';
import { BaseLoader } from '../../../shared/abstraction/loaderbase.component';
import { APP_CONSTANTS, IAppConstants } from '../../../config';

@Component({
    templateUrl: './__mobile__/refund-step2.component.html'
})

export class RefundStep2Component extends BaseLoader implements IRefundStep {
    public isValid: boolean = false;
    public seriesLength: number = 2;
    public numberLength: number = 6;
    public seriesPattern: string = '^[А-Яа-яЁё]{' + this.seriesLength + '}';
    public numberPattern: string = '[0-9]{' + this.numberLength + '}';
    @Output() change: EventEmitter<any> = new EventEmitter<any>();
    public user: CurrentUser;
    public _refundStepServiceSubscribe: Subscription;
    public startDate: Date = new Date();
    public ngAfterViewInit(): void { }
    @ViewChild('series') series; 

    constructor(private _authService: AuthHttpService,
        private _localStorage: UserStorageService,
        public _refundStepService: RefundStepService,
        @Inject(APP_CONSTANTS) public _constants: IAppConstants) {
        super();
    }

    ngOnInit() {
        this.getCurrentUser();
        this.Validate();
    }

    private getCurrentUser(): void {
        let withPrefix: number = 13;

        if (this._authService.isAuthenticated()) {
            this._refundStepService.clientInfo.user = this._localStorage.getUser();
            if (this._refundStepService.clientInfo.user.phone.length == withPrefix) {
                this._refundStepService.clientInfo.user.phone = this._refundStepService.clientInfo.user.phone.slice(3);
            }
        }
    }

    public Validate(): void {
        this.isValid = this._refundStepService.clientInfo.passport.issuedBy.length > 0 &&
            this._refundStepService.clientInfo.passport.number.length == this.numberLength &&
            (this._refundStepService.clientInfo.passport.series.length == this.seriesLength && !this.series.invalid) &&
            this._refundStepService.clientInfo.passport.whenIssued.toString().length > 0 &&
            this._refundStepService.clientInfo.user.phone.length == 10;
        this.change.emit(this.isValid);
    }

    public CheckNumbers(event) {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    public onDateChanged(event: any) {
        
    }
}