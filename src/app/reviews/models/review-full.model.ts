import { ReviewModel } from "./review.model";

export class ReviewFullModel extends ReviewModel {
    productName: string;
    productUrl: string;
    productId: number;
    likesCount: number;
    dislikesCount: number;
    //admin
    isActive: boolean;
    reviewId: number;
}