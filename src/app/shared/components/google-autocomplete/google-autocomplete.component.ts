import { Component, Input,  EventEmitter, Output } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { GoogleResponse, Result, DeliveryPoint } from '../../../models/models_adm';
import { debounceTime,  distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { BaseLoader } from '../../../shared/abstraction/loaderbase.component';
import { GoogleGeocodingService } from '../../../services/google-geocoding.service';


@Component({
    selector: 'google-autocomplete',
    templateUrl: './__mobile__/google-autocomplete.component.html'
})
export class GoogleAutocomplete extends BaseLoader {

    @Input() deliveryPoint: DeliveryPoint;
    private debounceTime: number = 1000;
    private minCharsCount: number = 3;
    private _addressObserver: Observable<GoogleResponse>;
    private _searchTerms: Subject<string> = new Subject<string>();
    public showDropDown: boolean = false;
    public googleResponse: GoogleResponse = new GoogleResponse([], "");
    @Output() onChangeAddress = new EventEmitter<DeliveryPoint>();

    constructor(
        private _geocodingService: GoogleGeocodingService
        ) {
        super();
    }

    ngOnInit() {
        if (!this.deliveryPoint)
            this.deliveryPoint = new DeliveryPoint();

        this._addressObserver = this._searchTerms.pipe(
            debounceTime(this.debounceTime),
            distinctUntilChanged(),
            switchMap((term:string) => {
                if (term.length >= this.minCharsCount) {
                    this.StartSpinning();
                    return this._geocodingService.addressGeocoding(term);
                } else {
                    return of<GoogleResponse>(new GoogleResponse([], ""));
                }
            }),
            catchError(error => {
                return of<GoogleResponse>(new GoogleResponse([], ""));
            }));

        this._addressObserver.subscribe(data => {
            this.EndSpinning();
            this.showDropDown = true;
            this.googleResponse = data;
        });
    }

    public onAddressItemSelect(item: Result): void {
        this.showDropDown = false;
        this.deliveryPoint.address = item.formatted_address;
        this.deliveryPoint.longitude = item.geometry.location.lng;
        this.deliveryPoint.latitude = item.geometry.location.lat;
        this.onChangeAddress.emit(this.deliveryPoint);
    }

    public searchAddress(term: string): void {
        this._searchTerms.next(term);
    }

    private hideDropdown() {
        this.showDropDown = false;
    }
}