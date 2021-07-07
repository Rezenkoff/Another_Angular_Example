﻿import { Component, Input } from '@angular/core';
import { ApplicabilityItem } from '../models';

@Component({
    selector: 'applicability-item',
    templateUrl: './__mobile__/applicability-item.component.html'
})


export class ApplicabilityItemComponent {

    @Input()
    public item: ApplicabilityItem;

    public hasChildren(): boolean {
        return Boolean(this.item.children && this.item.children.length != 0 && this.item.children[0].name);
    }

    public trackByFn(index, item) {
        return index;
    }
}

