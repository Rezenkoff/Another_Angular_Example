import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'promo-slider',
    templateUrl: './__mobile__/promo-slider.component.html',
})
export class PromoSliderComponent {

    public indicatorShown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private firstBackground: boolean = true;
    private secondBackground: boolean = false;
    private thirdBackground: boolean = false;

    public isFirstBackground(): boolean {
        return this.firstBackground;
    }
    public isSecondBackground(): boolean {
        return this.secondBackground;
    }
    public isThirdBackground(): boolean {
        return this.thirdBackground;
    }

    public applyIndicatorChanges(indicatorEnabled: boolean): void {
        this.indicatorShown$.next(indicatorEnabled);
    }

    public changeBackground(selectedBlock: number): void {
        switch (selectedBlock) {
            case 1: this.firstBackground = true;
                    this.secondBackground = false;
                    this.thirdBackground = false;
                break;
            case 2: this.firstBackground = false;
                    this.secondBackground = true;
                    this.thirdBackground = false;
                break;
            case 3: this.firstBackground = false;
                    this.secondBackground = false;
                    this.thirdBackground = true;
        }
    }
}