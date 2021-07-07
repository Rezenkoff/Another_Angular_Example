import { Component, Output, EventEmitter } from '@angular/core';
import { CarsPanelStateChange } from '../../car-select-panel/models/cars-panel-state-change.model';
import { AuthHttpService } from '../../auth/auth-http.service';

@Component({
    selector: 'slider-main-block',
    templateUrl: './__mobile__/slider-main-block.component.html',
})
export class SliderMainBlockComponent {

    @Output() onIndicatorChange: EventEmitter<boolean> = new EventEmitter<boolean>(); 

    private _panelState: CarsPanelStateChange[] = [];
    public carsCount: number = 0;
    public selectedTabIndex: number = 0;

    constructor(
        private _authHttpService: AuthHttpService,
    ) { }

    public checkChanges(change: CarsPanelStateChange[]): void {
        
        this._panelState = change;
        this.checkIndicator();
    }

    public checkCarsCount(count: number): void {
        this.carsCount = count;
        this.checkIndicator();
    }

    public selectTab(tabIndex: number): void {
        this.selectedTabIndex = tabIndex;
        this.checkIndicator();
    }

    private checkIndicator(): void {
        const indicatorEnabled = (
            (this.selectedTabIndex == 2
                && this.carsCount > 2) 
            || (this.selectedTabIndex == 0
                && this._panelState[1]
                && this._panelState[1].selectedOptions
                && this._panelState[1].selectedOptions.length > 0)
        );
        this.onIndicatorChange.emit(indicatorEnabled);
    }

    public isAuthenticated(): boolean {
        return this._authHttpService.isAuthenticated();
    }
}