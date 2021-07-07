import { Component, OnInit, Input, ChangeDetectionStrategy, Inject } from '@angular/core';
import { BehaviorSubject, timer, Subscription, Subject } from 'rxjs';
import { UserStorageService } from '../../services/user-storage.service';
import { CurrentUser } from '../../auth/models/current-user.model';
import { LanguageService } from '../../services/language.service';
import { AlertService } from '../../services/alert.service';
import { ALERT_TRANSLATIONS, IAlertTranslations } from '../../translate/custom/alert-translation';
import { ReviewsService } from '../services/reviews.service';
import { ReviewDtoModel } from '../models/review-dto.model';
import { APP_CONSTANTS, IAppConstants } from 'src/app/config';

@Component({
    selector: 'add-review',
    templateUrl: './__mobile__/add-review.component.html',
    styleUrls: ['./__mobile__/styles/add-review.component__.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddReviewComponent implements OnInit {

    @Input() productId: number;
    @Input() brandId: number;

    public mask = this._constants.PATTERNS.PHONE_MASK;
    public text: string;
    public name: string;
    public phone: string;
    public rate: number;
    private _user: CurrentUser;
    private regexpPhone = /(\d{10})|(\+\d{12})/g;
    private pointerTimer = new Subscription();
    public submitButtonShow$ = new Subject<string>();
    private key: string = 'userReviewPhone';
    private buttonTimeIsExpired = false;

    constructor(
        private _reviewsService: ReviewsService,
        private _userService: UserStorageService,
        private _alertService: AlertService,
        private _languageService: LanguageService,
        @Inject(ALERT_TRANSLATIONS) public _translations: IAlertTranslations,
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
    ) { }

    ngOnInit() {
        this._user = this._userService.getUser();
        if (this._user && this._user.name) {
            this.name = this._user.name;
            this.phone = this._user.phone;
        }

        this.checkButtonTime();  
    }

    public checkButtonTime()
    {
        let cid = this._userService.getClientId();

        if(cid == "")
        {
           cid = localStorage.getItem(this.key);

           if(!cid)
           {
               cid = "";
           }
        }

            this._reviewsService.CheckCacheTime(cid).subscribe((timeResult)=> {

            if(timeResult == 0)
            {
                this.submitButtonShow$.next('Оставить отзыв');
                this.buttonTimeIsExpired = true;
            }
            else{
                this.buttonTimeIsExpired = false;
                this.startTimer(timeResult);
            }    
            });     
    }

    ngOnDestroy()
    {
        this.pointerTimer.unsubscribe();
    }

    private startTimer(time: number) {
        const source = timer(0, 1000);
        this.submitButtonShow$.next('01:00');
        
        this.pointerTimer = source.subscribe(val => {
            let submitButtonShow = (val >= 50 ? "00:0" : "00:") + (time - val).toString();
            this.submitButtonShow$.next(submitButtonShow);
            
            if (val == time) {
                this.buttonTimeIsExpired = true;
                this.submitButtonShow$.next('Оставить отзыв');
                this.pointerTimer.unsubscribe();
            }
        });
    }

    public setSelectedRate(rate: number): void {
        this.rate = rate;
    }

    public submitEnabled(): boolean {
        return (
            this.buttonTimeIsExpired && this.name && this.name.trim().length > 0
            && ((this.text && this.text.trim().length > 0) || this.rate > 0)            
            );
    }

    public submit(): void {
        if (this.phone) {
            if (this.phone.length > 13 || this.phone.search(this.regexpPhone) == -1) {
                this._alertService.error("Неверно указан номер телефона");
                return; 
            }
        }
       
        const review: ReviewDtoModel = {
            parentReviewId: null,
            authorName: this.name,
            phone: this.phone,
            rate: this.rate,
            text: this.text,
            dateTime: new Date()
        };

        this.startTimer(59);
        let cid = this._userService.getClientId();
        localStorage.setItem(this.key, this.phone);
        this.buttonTimeIsExpired = false;
        this.submitEnabled();

        this._reviewsService.saveReview(review, this._user, this.productId, this.brandId, cid)
            .subscribe(result => {
                const language = this._languageService.getSelectedLanguage().name;
                if (result && result.success) {
                    const msg = this._translations.SUCCESS["review_add_success_" + language];
                    this._alertService.success(msg);
                    return;
                }
                const msg = this._translations.ERRORS["review_add_error_" + language];
                this._alertService.error(msg);
            })
    }
}