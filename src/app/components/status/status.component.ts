import { Component, ViewChild } from '@angular/core';
import { OrderDetailsWithoutPopupComponent } from '../../shared/components/order-details-without-popup.component';

@Component({
    selector: 'status',
    templateUrl: './__mobile__/status.component.html',
    styleUrls: ['./__mobile__/styles/status.component__.scss']
})
export class StatusComponent {
    @ViewChild('orderdetailswithoutpopup') _orderDetailsWithoutPopupComponent: OrderDetailsWithoutPopupComponent;
    constructor() {
    }
    
}
