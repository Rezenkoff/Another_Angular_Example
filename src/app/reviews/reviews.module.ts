/*MODULES*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
import { SharedModule } from '../shared/modules/shared.module';
import { LocationModule } from '../location/location.module';

/*COMPONENTS*/
import { AddReviewComponent } from './components/add-review.component';
import { BrandReviewsComponent } from './components/brand-reviews.component';
import { ProductReviewsComponent } from './components/product-reviews.components';
import { ProductRateComponent } from './components/product-rate.component';
import { ProductRateSmallComponent } from './components/product-rate-small.component';
import { ReviewComponent } from './components/review.component';
import { BrandReviewComponent } from './components/brand-review.component';
import { ReviewsListComponent } from './components/reviews-list.component';
import { StarComponent } from './components/star.component';


/*PIPES, SERVICES, DIRECTIVES*/
import { ReviewsService } from './services/reviews.service';
import { RateMainComponent } from './components/rate-main.component';
import { ReplyFormComponent } from './components/reply-form.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
    imports: [
        CommonModule,
        SharedCommonModule,
        SharedModule,
        LocationModule,
        NgxMaskModule.forRoot(options)
    ],
    declarations: [
        AddReviewComponent,
        BrandReviewsComponent,
        ProductReviewsComponent,
        ProductRateComponent,
        ProductRateSmallComponent,
        ReviewComponent,
        BrandReviewComponent,
        ReviewsListComponent,
        StarComponent,
        RateMainComponent,
        ReplyFormComponent
    ],
    exports: [
        AddReviewComponent,
        BrandReviewsComponent,
        ProductReviewsComponent,
        RateMainComponent,
        ProductRateComponent,
        ReplyFormComponent,
    ],
    providers: [
        ReviewsService,
    ],
})
export class ReviewsModule {

}