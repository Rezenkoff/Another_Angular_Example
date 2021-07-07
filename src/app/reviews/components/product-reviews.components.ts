import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ReviewModel } from '../models/review.model';
import { ReviewsService } from '../services/reviews.service';

@Component({
    selector: 'product-reviews',
    templateUrl: './__mobile__/product-reviews.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductReviewsComponent implements OnInit {

    @Input() productId: number = 0;
    public reviews: ReviewModel[] = [];

    constructor(
        private _reviewsService: ReviewsService, private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this._reviewsService.getProductReviews(this.productId).subscribe(data => {
            this.reviews = data.reviews;
            this.cd.detectChanges();
        });
    }

    public trackByFn(index, item) {
        return index;
    }

    public closeOthersReplyForms(reviewId: number) {
        this.closeChildForms(this.reviews, reviewId);
    }

    private closeChildForms(childReviews: ReviewModel[], reviewId: number) {
        childReviews.forEach(x => {
            if (x.reviewId != reviewId) {
                x.replyFormShown = false;
            }
            if (x.childReviews?.length) {
                this.closeChildForms(x.childReviews, reviewId);
            }
        });
    }
}