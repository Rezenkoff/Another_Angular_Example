import { Component, Input } from '@angular/core';

@Component({
    selector: 'expand-component',
    templateUrl: './expand.component.html'
})
export class ExpandComponent {
    @Input() canexpand: Boolean;
    @Input() title: string;
}