import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { DeliveryPointGeocoded } from "../../delivery/points/delivery-point-geocoded.model";

@Component({
    selector: 'courier-delivery-select',
    templateUrl: './__mobile__/courier-delivery-select.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourierDeliverySelectComponent implements OnInit {

    @Input() userAddress: string = ''; 
    @Output() courierDeliveryChanged: EventEmitter<string> = new EventEmitter<string>();

    public deliveryOnAddress: DeliveryPointGeocoded = new DeliveryPointGeocoded();

    ngOnInit() {
        if (this.userAddress) {
            this.deliveryOnAddress = new DeliveryPointGeocoded();
            this.deliveryOnAddress.address = this.userAddress;
            this.onAddressItemSelect(this.deliveryOnAddress);
        }
    }

    public onAddressItemSelect(deliveryPoint: DeliveryPointGeocoded) {
        this.deliveryOnAddress = deliveryPoint;
        this.userAddress = deliveryPoint.address;
        this.courierDeliveryChanged.emit(this.userAddress);
    }

    public selectAddressWarningShown(): boolean {
        return (this.userAddress == null);
    }
}