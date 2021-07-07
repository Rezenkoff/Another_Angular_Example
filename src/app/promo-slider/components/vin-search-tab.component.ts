import { Component, ViewChild } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { PolisService } from '../../polis/polis.service';
import { BehaviorSubject } from 'rxjs';
import { VinSearchInputComponent } from '../../shared/components/home/vin-search-input.component';

@Component({
    selector: 'vin-search-tab',
    templateUrl: './__mobile__/vin-search-tab.component.html'
})
export class VinSearchTabComponent {

    @ViewChild(VinSearchInputComponent) vinSearchInput: VinSearchInputComponent;
    searchString: string = '';
    public isSearching$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public errorMessageShown: boolean = false;

    constructor(
        private _navigationService: NavigationService,
        private _polisService: PolisService,
    ) { }

    public vinSearch(code: string): void {
        this.errorMessageShown = false;
        this.isSearching$.next(true);
        this._navigationService.NavigateToFindByAuto(code);
    }

    public governmentNumSearch(code: string): void {
        this.errorMessageShown = false;
        this.isSearching$.next(true);
        this._polisService.GetCarInfoByNumber(code)
            .subscribe((carInfoResponse:any) => {
                if (carInfoResponse.success && carInfoResponse.data.car.vin) {
                    this.searchString = carInfoResponse.data.car.vin;
                    this.isSearching$.next(false);
                    this._navigationService.NavigateToFindByAuto(carInfoResponse.data.car.vin);
                } else {
                    this.isSearching$.next(false);
                    this.errorMessageShown = true;
                }
            });
    }

    public callInputCheck(): void {
        this.errorMessageShown = false;
        this.isSearching$.next(true);
        this.vinSearchInput.check();
    }

    public invalidCodeEnter(code: string) {
        this.errorMessageShown = true;
        this.isSearching$.next(false);
    }

    public IsSearchStringEmpty(): boolean {
        return this.vinSearchInput.searchString.length > 0;
    }
}