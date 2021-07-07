import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';

@Component({
    selector: 'product-rate',
    templateUrl: './__mobile__/product-rate.component.html',
    styleUrls: ['./__mobile__/styles/product-rate.component__.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductRateComponent {
    @Input() rate: number = 0;
    @Output() rateSelected: EventEmitter<number> = new EventEmitter<number>();
    
    public setRate(rate: number): void {
        this.rate = rate;
        this.rateSelected.emit(this.rate);
    }
}