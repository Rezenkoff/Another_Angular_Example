import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { GoogleMapsService } from '../../google-maps/google-maps.service';

@Component({
    selector: 'delivery-point',
    templateUrl: './__mobile__/delivery-point.component.html'
})
export class DeliveryPointComponent {
    public markersList: any = [];
    public selectedAddress: string = "";
    public showDropDown: boolean = false;
    @Input() cityId: number;
    @Input() shipmentTypeKey: number;
    public address: string = '';
    @Input() paymentId: number = 0;

    @Output() onMarkerSelect: EventEmitter<any> = new EventEmitter<any>();

    constructor( @Inject(APP_CONSTANTS) private _constants: IAppConstants, private _googleMapsService: GoogleMapsService) { }

    public hideDropdown(): void {
        this.showDropDown = false;
    }

    public getDisplay(): string {
        return this.showDropDown ? this._constants.STYLING.DISPLAY_BLOCK : this._constants.STYLING.DISPLAY_NONE;
    }

    public searchAddress(address: string): void {
        this.showDropDown = true;
        
        this._googleMapsService.GetMarkers(this.shipmentTypeKey, this.paymentId, this.cityId)
            .subscribe(data => {
                this.markersList = data.filter(x => {
                    let lowerAddress = address.toLowerCase();
                    let lowerDeliveryAddress = this.shipmentTypeKey == 3 ? x.shortName.toLowerCase() : x.address.toLowerCase();
                    return lowerDeliveryAddress.includes(lowerAddress);
                })
                if (this.markersList.length == 0)
                    this.showDropDown = false;
            });
    }

    public onMarkerItemSelect(item: any): void {
        this.showDropDown = false;
        this.onMarkerSelect.emit(item);
    }
}



