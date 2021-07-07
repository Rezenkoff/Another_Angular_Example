import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'success',
    templateUrl: './__mobile__/success.component.html'
})
export class SuccessComponent {
    orderId: string = '';
    secretLinkCode: string = '';
    constructor(private route: ActivatedRoute) {
        this.orderId = this.route.snapshot.params['orderId'];
        this.secretLinkCode = this.route.snapshot.params['orderSecretLinkCode'];
    }

    doSomething() {

    }
}
