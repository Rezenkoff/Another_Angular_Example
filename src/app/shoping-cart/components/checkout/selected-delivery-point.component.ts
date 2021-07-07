import { Component, Input, ChangeDetectionStrategy} from "@angular/core";
import { DeliveryPointGeocoded } from "../../../delivery/points/delivery-point-geocoded.model";
import { Observable } from "rxjs";

@Component({
    selector: 'selected-delivery-point',
    templateUrl: './__mobile__/selected-delivery-point.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDeliveryPointComponent {

    @Input() deliveryPoint$: Observable<DeliveryPointGeocoded> = new Observable<DeliveryPointGeocoded>();

}