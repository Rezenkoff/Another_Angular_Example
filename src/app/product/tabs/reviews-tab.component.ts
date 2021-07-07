import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'reviews-tab',
    templateUrl: './__mobile__/reviews-tab.component.html',
    styleUrls: ['./__mobile__/styles/reviews-tab.component__.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsTabComponent {
    @Input() productId: number;
    @Input() brandId: number;

}