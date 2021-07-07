import { ElementRef, EventEmitter, Output, Directive, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from "@angular/common";

@Directive()
export class DeferLoadBase {

    protected _intersectionObserver?: IntersectionObserver;

    constructor(
        protected _element: ElementRef, @Inject(PLATFORM_ID) protected _platformId,
    ) { }

    public ngAfterViewInit() {
        if (isPlatformBrowser(this._platformId)) {
            this._intersectionObserver = new IntersectionObserver(entries => {
                this.checkForIntersection(entries);
            }, {});
            this._intersectionObserver.observe(<Element>(this._element.nativeElement));
        }
    }

    protected checkForIntersection = (entries: Array<IntersectionObserverEntry>) => {
    }

    protected checkIfIntersecting(entry: IntersectionObserverEntry) {
        return (<any>entry).isIntersecting && entry.target === this._element.nativeElement;
    }
}