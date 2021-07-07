import { Component, ChangeDetectionStrategy, Input, OnInit, Inject, EventEmitter, Output } from "@angular/core";
import { CurrentUser } from "../../auth/models";
import { UserStorageService } from "../../services/user-storage.service";
import { AlertService } from "../../services/alert.service";
import { LanguageService } from "../../services/language.service";
import { ReviewsService } from "../services/reviews.service";
import { ALERT_TRANSLATIONS, IAlertTranslations } from "../../translate/custom/alert-translation";
import { ReviewModel } from "../models/review.model";
import { ReviewDtoModel } from "../models/review-dto.model";
import { APP_CONSTANTS, IAppConstants } from "src/app/config";

@Component({
    selector: 'reply-form',
    templateUrl: './__mobile__/reply-form.component.html',
    styleUrls: ['./__mobile__/styles/reply-form.component__.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReplyFormComponent implements OnInit {

    @Input() parentReviewId: number;

    @Output() replySaved: EventEmitter<ReviewModel> = new EventEmitter<ReviewModel>();

    public mask = this._constants.PATTERNS.PHONE_MASK;
    public text: string;
    public name: string;
    public phone: string;
    public rate: number;
    private _user: CurrentUser;
    public isLoading: boolean = false;
    private regexpPhone = /(\d{10})|(\+\d{12})/g;

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
        }
    }

    public setSelectedRate(rate: number): void {
        this.rate = rate;
    }

    public submitEnabled(): boolean {
        return (
            this.name && this.name.trim().length > 0
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

        this.isLoading = true;
        const review: ReviewDtoModel = {
            parentReviewId: this.parentReviewId,
            authorName: this.name,
            phone: this.phone,
            rate: this.rate,
            text: this.text,
            dateTime: new Date()
        };
        this._reviewsService.saveReply(review, this._user)
            .subscribe(result => {
                const language = this._languageService.getSelectedLanguage().name;
                if (result && result.success) {
                    const msg = this._translations.SUCCESS["review_add_success_" + language];
                    let newReview: ReviewModel = { ...new ReviewModel(), ...review };
                    this.replySaved.emit(newReview);
                    this._alertService.success(msg);
                    this.isLoading = false;
                    return;
                }
                const msg = this._translations.ERRORS["review_add_error_" + language];
                this._alertService.error(msg);
                this.isLoading = false;
            })
    }
}