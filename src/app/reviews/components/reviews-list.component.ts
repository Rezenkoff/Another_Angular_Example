import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ReviewModel } from '../models/review.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'reviews-list',
    templateUrl: './__mobile__/reviews-list.component.html',
    styleUrls: ['./__mobile__/styles/reviews-list.component__.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsListComponent implements OnInit {

    @Input() reviews$: Observable<ReviewModel[]> = new Observable<ReviewModel[]>();
    @Input() showProductName: boolean = false;
    public plurality: number = 0;
    public reviewsList: ReviewModel[] = [];

    ngOnInit() {
        this.reviews$.subscribe(reviews => {
            this.setPlurality(reviews);
        });
    }

    private setPlurality(reviews: ReviewModel[]): void {
        const divideRest: number = reviews.length % 10;
        if (divideRest == 1) {
            this.plurality = 2;
        } else if (divideRest >= 2 && divideRest <= 4) {
            this.plurality = 1;
        } else {
            this.plurality = 0;
        }
    }

    public trackByFn(index, item) {
        return index;
    }
}