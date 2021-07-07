
import { ReviewModel } from "../models/review.model";
import { CurrentUser } from "../../auth/models";
import { Observable } from "rxjs";
import { Result } from "../../models/result.model";
import { map, share, finalize } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { ProductReviews } from "../models/product-reviews.model";
import { ReviewFullModel } from "../models/review-full.model";
import { BrandReviews } from "../models/brand-reviews.model";
import { ReviewDtoModel } from "../models/review-dto.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable()
export class ReviewsService {

    private _cachedSubs: Map<number, Observable<ProductReviews>> = new Map<number, Observable<ProductReviews>>();

    constructor(        
        private _http: HttpClient
    ) { }

    public getProductReviews(productId: number): Observable<ProductReviews> {

        const sub = this._cachedSubs.get(productId);
        if (sub) {
            return sub;
        }

        const params = new HttpParams()
            .set('productId', productId.toString());

        let newSub = null;

        //transfer state use here
        newSub = this._http.get(environment.apiUrl + 'reviews/get-for-product', { params })
            .pipe(map((reviews: ProductReviews) => {
                    const reviewsTree = this.getReviewsTree(reviews.reviews);
                    reviews.reviews = reviewsTree;
                    return reviews;
                }),
                share(),
                finalize(() => this._cachedSubs.delete(productId))); 

        this._cachedSubs.set(productId, newSub);

        return newSub;
    }

    public getBrandReviews(brandId: number): Observable<BrandReviews> {

        const params = new HttpParams()
            .set('brandId', brandId.toString());
      
        return this._http.get<BrandReviews>(environment.apiUrl + 'reviews/get-for-brand', { params })
            .pipe(map((reviews: BrandReviews) => {
                const reviewsTree = this.getReviewsTree(reviews.reviews);
                reviews.reviews = reviewsTree as ReviewFullModel[];
                return reviews;
            }));
    }

    public getBrandId(brandUrl: string): number {
        const startIdx = brandUrl.indexOf("-id") + 3;
        const endIdx = brandUrl.length;
        const idStr = brandUrl.substring(startIdx, endIdx);
        return parseInt(idStr);
    }

    public saveReview(review: ReviewDtoModel, user: CurrentUser, productId: number, brandId: number, reviewKey: string): Observable<Result> {
        let request = new ReviewRequestModel();
        request = {
            ...request,
            ...review,
            userPhone: (user) ? user.phone : null,
            productId: productId,
            brandId: brandId,
            reviewDataPoint: reviewKey
        }

        //intercept for auth
        return this._http.post<Result>(environment.apiUrl + 'reviews/add', JSON.stringify(request));
    }

    public CheckCacheTime(key: string):Observable<number>
    {
        return this._http.post<number>(environment.apiUrl + 'reviews/cacheReview', JSON.stringify({reviewDataKey: key}));
    }

    public saveReply(review: ReviewDtoModel, user: CurrentUser): Observable<Result> {
        let request = new ReviewRequestModel();
        request = {
            ...request,
            ...review,
            userPhone: (user) ? user.phone : null
        }

        //intercept for auth
        return this._http.post<Result>(environment.apiUrl + 'reviews/add-reply', JSON.stringify(request));
    }

    public likeReview(model: any) {
        //intercept for auth
        return this._http.post<Result>(environment.apiUrl + 'reviews/like', JSON.stringify(model));
    }

    private getReviewsTree(reviews: ReviewModel[]): ReviewModel[] {
        let tree: ReviewModel[] = [];
        let reviewsMap: Map<number, ReviewModel> = new Map<number, ReviewModel>();

        reviews.forEach(x => {
            reviewsMap.set(x.reviewId, x);
            if (!x.parentReviewId) {   
                tree.push(x);
                return;
            }
            let review = reviewsMap.get(x.parentReviewId);
            if (!review) {
                return;
            }
            review.childReviews = (review.childReviews) ? [...review.childReviews, x] : [x];
        });

        return tree;
    }
}

class ReviewRequestModel extends ReviewDtoModel {
    userPhone: string;
    productId: number;
    brandId: number;
    reviewDataPoint: string
}