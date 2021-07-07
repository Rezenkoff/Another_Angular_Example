import { Directive, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Directive({
    selector: '[customSwipe]'
})

export class CustomSwipeDirective {
    overlay;
    mobileBlock;
    SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        this.overlay = document.getElementsByClassName('mobile-overlay');
        this.mobileBlock = document.getElementsByClassName('mobile-block');
    }

    @HostListener('swiperight', ['$event'])
    swiperight(event: any) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        if (event.type === this.SWIPE_ACTION.RIGHT) {
            if (this.overlay && this.overlay.length > 0) {
                for (let item of this.overlay)
                    this.addActiveClass(item);
            }
            if (this.mobileBlock && this.mobileBlock.length > 0) {
                for (let item of this.mobileBlock)
                    this.addActiveClass(item);
            }
        }
    }

    @HostListener('swipeleft', ['$event'])
    swipeleft(event: any) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        if (event.type === this.SWIPE_ACTION.LEFT) {
            if (this.overlay && this.overlay.length > 0) {
                for (let item of this.mobileBlock)
                    this.removeActiveClass(item);
            }
            if (this.mobileBlock && this.mobileBlock > 0) {
                for (let item of this.mobileBlock)
                    this.removeActiveClass(item);
            }
        }
    }

    addActiveClass(item: HTMLDivElement) {
        item.classList.add('active');
    }

    removeActiveClass(item: HTMLDivElement) {
        item.classList.remove('active');
    }
}