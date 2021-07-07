import { Directive, ElementRef, Renderer2, Input, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { environment } from '../../../environments/environment';

@Directive({ selector: '[svg-use-reference]' })
export class SvgReferenceDirective {

    constructor(
        private _el: ElementRef,
        private _renderer: Renderer2,
        @Inject(PLATFORM_ID) private platformId: Object) {
    }

    @Input('svg-use-reference') _svgRef: string;

    ngAfterViewInit() {
        let href = environment.svgBasePath + this._svgRef;

        if (isPlatformServer(this.platformId)) {
            // node
            this._renderer.setAttribute(this._el.nativeElement, 'xlink:href', href);
        }
        if (isPlatformBrowser(this.platformId)) {
            // browser
            this._el.nativeElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
        }
    }

}

