import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { ReviewsService } from '../services/reviews.service';
import { BrandsCatalogService } from '../../brands-catalog/service/brands-catalog.service';

import { BrandReviews } from '../models/brand-reviews.model';
import { Brand } from '../../brands-catalog/models/brand.model';

@Component({
    selector: 'brand-reviews',
    templateUrl: './__mobile__/brand-reviews.component.html'
})
export class BrandReviewsComponent {

    public brand: Brand = new Brand();
    public reviews$: BehaviorSubject<BrandReviews> = new BehaviorSubject<BrandReviews>(null);

    public countShowedReviews: number = 3;
    public isShowAddReview: boolean = false;

    constructor(
        private _reviewsService: ReviewsService,
        private _activatedRoute: ActivatedRoute,
        private _brandsCatalogService: BrandsCatalogService,
    ) { }

    ngOnInit() {
        let params = this._activatedRoute.snapshot.params;
        let brandUrl = params['brand'] || '';
        const brandId: number = this._reviewsService.getBrandId(brandUrl);
        this._reviewsService.getBrandReviews(brandId).subscribe(data => this.reviews$.next(data));

        this._brandsCatalogService.getBrandByUrl(brandUrl).subscribe(result => {
            if (result) {
                this.brand = result;
            }
        });
    }

    public showMoreReviews() {
        this.countShowedReviews += 3;
    }
}