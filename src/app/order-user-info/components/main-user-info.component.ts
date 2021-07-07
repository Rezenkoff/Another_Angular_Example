import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from '../../shared/validators/email.validator';
import { CurrentUser } from '../../auth/models';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MainUserInfoModel } from '../models/main-user-info.model';

@Component({
    selector: 'main-user-info',
    templateUrl: './__mobile__/main-user-info.component.html'
})
export class MainUserInfoComponent implements OnInit, OnDestroy {

    @Input() userInfo$: Observable<CurrentUser> = new Observable<CurrentUser>();
    private userInfo: CurrentUser = new CurrentUser("","", "", "", "", "", false, "", null);
    @Output() onUserInfoChange = new EventEmitter<MainUserInfoModel>();
    @Output() onInputClick = new EventEmitter<boolean>();
    orderContactInfoGroup: FormGroup;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private fb: FormBuilder,
    ) { }

    ngOnInit() {
        this.init();
        this.userInfo$.pipe(takeUntil(this.destroy$)).subscribe(user => {
            this.userInfo = user;
            if (this.userInfo && this.userInfo.phone) {
                this.userInfo.phone = this.userInfo.phone;
            }
            this.init();
            let data = this.orderContactInfoGroup.value;
            this.emit(data);
        })
    }

    private init(): void {
        this.orderContactInfoGroup = this.fb.group({
            'name': new FormControl(this.userInfo.name, Validators.compose([Validators.required])),
            'email': new FormControl(this.userInfo.email, Validators.compose([CustomValidators.emailValidator])),
            'phone': new FormControl(this.userInfo.phone, Validators.compose([Validators.required, CustomValidators.phoneValidator]))
        });

        this.orderContactInfoGroup.valueChanges.subscribe((data: MainUserInfoModel) => {
            this.emit(data);
        });
    }

    private emit(data: MainUserInfoModel) {
        data.isValid = !this.orderContactInfoGroup.invalid;
        this.onUserInfoChange.emit(data);
    }

    public processInputClick(): void {
        this.onInputClick.emit(true);
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}