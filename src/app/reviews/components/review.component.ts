import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReviewModel } from '../models/review.model';

@Component({
    selector: 'review',
    templateUrl: './__mobile__/review.component.html',
    styleUrls: ['./__mobile__/styles/review.component__.scss']
})

export class ReviewComponent {
    @Input() review: ReviewModel;
    @Input() productId: number;
    @Input() needStars: boolean;

    @Output() public closeOthersReplyForms: EventEmitter<number> = new EventEmitter();

    public isShowAnswerArea: boolean = false;

    public trackByFn(index, item) {
        return index;
    }

    public showReplyForm(): void {
        if (!this.review.replyFormShown) {
            this.closeOthersReplyForms.emit(this.review.reviewId);
        }
        this.review.replyFormShown = !this.review.replyFormShown;
    }

    public closeReplyForms(reviewId: number){
        this.closeOthersReplyForms.emit(reviewId);
    }

    public updateReviews(reply: ReviewModel): void {
        const childReviews = (this.review.childReviews) ? [...this.review.childReviews, reply] : [reply];

        this.review = {
            ...this.review,
            childReviews: childReviews
        }
        this.review.replyFormShown = false;
    }

    public getInitials() {
        let initials = this.review.authorName.split(' ').slice(0, 2).map(x => x[0]).join('');
        return initials;
    }

    public showAnswerArea() {
        this.isShowAnswerArea = !this.isShowAnswerArea;
    }
}