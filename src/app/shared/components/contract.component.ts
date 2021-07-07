﻿import { Component, HostListener } from '@angular/core';
import { BaseBlockComponent } from '../abstraction/base-block.component';

@Component({
    selector: 'contract',
    templateUrl: './__mobile__/contract.component.html'
})
export class ContractComponent extends BaseBlockComponent {
    @HostListener('window:keyup', ['$event']) onKeyDown(event) {
        let e = <KeyboardEvent>event;
        if (e.keyCode == 27) {
            this.isShowDropDown = false;
        }
    }
}
