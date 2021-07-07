export class ReviewModel {
    reviewId: number;
    authorName: string;
    isAdmin: boolean;
    text: string;
    rate: number;    
    dateTime: Date;
    parentReviewId: number;
    childReviews: ReviewModel[];

    replyFormShown: boolean;
} 