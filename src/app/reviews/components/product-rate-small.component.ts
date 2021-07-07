import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'product-rate-small',
    templateUrl: './__mobile__/product-rate-small.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductRateSmallComponent {
    @Input() rate: number = 0;
}