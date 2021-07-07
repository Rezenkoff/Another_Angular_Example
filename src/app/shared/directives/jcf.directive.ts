import { Directive, ElementRef, OnDestroy, HostListener, Input, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as jcf from 'jcf';

@Directive({
    selector: '[jcf]'
})
export class JcfDirective implements OnDestroy {

    @Input('jcf') option: any;
    constructor(private element: ElementRef, @Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit() {
        if (!this.option || !this.option.type)
            console.error("Specify options to be customized");
    }

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) {
            jcf.setOptions(this.option.type, this.getJcfOptions());
            jcf.replace(this.element.nativeElement);
        }
    }

    @HostListener('change', ['$event'])
    onChange(event: any) {
        jcf.refresh(this.element.nativeElement);
    }

    ngOnDestroy() { }

    private getJcfOptions(): any {
        switch (this.option.type) {
            case 'Select':
                return {
                    wrapNativeOnMobile: false, wrapNative: false, fakeDropInBody: false
                };
            case 'File':
                return {
                    buttonText: this.option.placeHolder
                };
            case 'Radio':
                return this.option.checked ? { checkedClass: 'jcf-checked' } : {};
            default:
                return {};
        }
    }
}