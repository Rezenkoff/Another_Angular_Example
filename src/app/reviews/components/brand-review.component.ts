import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ReviewFullModel } from '../models/review-full.model';
import { CookieService } from 'ngx-cookie-service';
import { ReviewsService } from '../services/reviews.service';
import { ReviewModel } from '../models/review.model';

const liked: string = 'liked';
const disliked: string = 'disliked';

@Component({
    selector: 'brand-review',
    templateUrl: './__mobile__/brand-review.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandReviewComponent implements OnInit {

    @Input() review: ReviewFullModel;
    @Input() parentReview: ReviewFullModel = null;

    public isLiked: boolean = false;
    public isDisliked: boolean = false;

    public isShowAnswerArea: boolean = false;

    constructor(private _cookieService: CookieService, private _reviewsService: ReviewsService) { }

    ngOnInit() {
        this.initializeLike();
    }

    public getInitials() {
        let initials = this.review.authorName.split(' ').slice(0, 2).map(x => x[0]).join('');
        return initials;
    }

    public likeClick() {
        let isNeedToAddLike = !this.isLiked;

        let likeTypes = [];

        if (isNeedToAddLike) {
            likeTypes.push(0);
            this.review.likesCount++;
        }

        this.sendLikeRequest(likeTypes);
        this.like(this.isLiked ? '' : liked);
    }

    public dislikeClick() {
        let isNeedToAddDislike = !this.isDisliked;

        let likeTypes = [];

        if (isNeedToAddDislike) {
            likeTypes.push(2);
            this.review.dislikesCount++;
        }

        this.sendLikeRequest(likeTypes);
        this.like(this.isDisliked ? '' : disliked);
    }

    public showAnswerArea() {
        this.isShowAnswerArea = !this.isShowAnswerArea;
    }

    public updateReviews(reply: ReviewModel) {
        const childReviews = (this.review.childReviews) ? [...this.review.childReviews, reply] : [reply];
        this.review = {
            ...this.review,
            childReviews: childReviews
        }
        this.isShowAnswerArea = false;
    }

    private like(data: string) {
        this._cookieService.set(`reviewLike_${this.review.reviewId}`, data);
        this.initializeLike();
    }

    private initializeLike() {
        let reviewLike = this._cookieService.get(`reviewLike_${this.review.reviewId}`);
        if (reviewLike === liked) {
            this.isLiked = true;
            this.isDisliked = false;
        }
        else if (reviewLike === disliked) {
            this.isDisliked = true;
            this.isLiked = false;
        }
        else {
            this.isDisliked = false;
            this.isLiked = false;
        }
    }

    private sendLikeRequest(likeTypes: number[]) {
        let isNeedToUndoLike = this.isLiked;
        let isNeedToUndoDislike = this.isDisliked;

        if (isNeedToUndoLike) {
            likeTypes.push(1);
            this.review.likesCount--;
        }
        if (isNeedToUndoDislike) {
            likeTypes.push(3);
            this.review.dislikesCount--;
        }

        let model = {
            reviewId: this.review.reviewId,
            likeTypes: likeTypes
        };

        this._reviewsService.likeReview(model).subscribe(x => this.initializeLike());
    }
}

