import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
    selector: 'rate-main',
    templateUrl: './__mobile__/rate-main.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RateMainComponent implements OnInit {
    @Input() rate: number = 0;
    @Input() reviewsCount: number = 0;
    @Output() reviewsClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
    public plurality: number = 0;

    public ngOnInit() {
        this.setPlurality();
    }

    public getRoundedRate(): number {
        return Math.round(this.rate);
    }

    public scrollToAnalogs(): void {
        this.reviewsClicked.emit(true);
    }

    private setPlurality(): void {
        const divideRest: number = this.reviewsCount % 10;
        if (divideRest == 1) {
            this.plurality = 2;
        } else if (divideRest >= 2 && divideRest <= 4) {
            this.plurality = 1;
        } else {
            this.plurality = 0;
        }
    }
}