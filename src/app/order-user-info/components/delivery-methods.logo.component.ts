import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs";

@Component({
    selector: 'delivery-method-logo',
    templateUrl: './__mobile__/delivery-method-logo.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryMethodLogoComponent {

    @Input() deliveryMethodKey$: Observable<string> = new Observable<string>();

}