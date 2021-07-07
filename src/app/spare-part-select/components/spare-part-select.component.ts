import { Component } from "@angular/core";
import { UserCar } from "../../vehicle/models/user-car.model";
import { OrderStepService } from "../../order-step/order-step.service";
import { AuthHttpService } from "../../auth/auth-http.service";
import { NavigationService } from "../../services/navigation.service";

@Component({
    selector: 'spare-part-select',
    templateUrl: './__mobile__/spare-part-select.component.html'
})
export class SparePartSelectComponent {

    public stepNumber: number = 1;
    public selectedCar: UserCar;

    constructor(private _orderStepService: OrderStepService, private navigation: NavigationService, private _authHttpService: AuthHttpService, ) { }

    public goToPreviousStep(isGoToPreviousStep: boolean) {
        if (isGoToPreviousStep) {
            this.stepNumber--;
        }
    }

    public selectCar(car: UserCar) {
        this.selectedCar = car;
        this.stepNumber++;
    }

    public ConfirmOrder(isOrderValid: boolean): void {

        if (!this._authHttpService.isAuthenticated()) {

            this._orderStepService.createConfirmOrderIfUserIsNotAuthentificated().subscribe(() => {

                this.sendConfirmOrder(isOrderValid);    
            });
        }

        if (this._authHttpService.isAuthenticated()) {

            this.sendConfirmOrder(isOrderValid);
        }
    }

    public sendConfirmOrder(isOrderValid: boolean) {

        if (isOrderValid) {
            this._orderStepService.PostOrder().subscribe(result => {
                let orderId = result.id;
                let orderSecretLinkCode = this._authHttpService.isAuthenticated() ? '' : result.link;

                this._orderStepService.resetModel();

                this.navigation.NavigateToSuccessOrder(orderId, orderSecretLinkCode);
            });
        }
    }
}