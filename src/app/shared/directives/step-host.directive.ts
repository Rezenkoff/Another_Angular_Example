import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[step-host]',
})
export class StepHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}