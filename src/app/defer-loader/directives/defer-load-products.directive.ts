import { ElementRef, EventEmitter, Output, Directive, Inject, PLATFORM_ID } from '@angular/core';
import { DeferLoadBase } from './defer-load-base.directive';

@Directive({
    selector: '[deferLoadProducts]'
})
export class DdeferLoadProductsDirective extends DeferLoadBase{
    @Output() public deferLoadProducts: EventEmitter<any> = new EventEmitter();

    constructor(
        _element: ElementRef,
        @Inject(PLATFORM_ID) _platformId) {
        super(_element, _platformId);
    }


    protected checkForIntersection = (entries: Array<IntersectionObserverEntry>) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (this.checkIfIntersecting(entry)) {
                this.deferLoadProducts.emit();
                this._intersectionObserver.unobserve(<Element>(this._element.nativeElement));
                this._intersectionObserver.disconnect();
            }
        });
    }
}