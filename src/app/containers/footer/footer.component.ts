import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'footer',
    templateUrl: './__mobile__/footer.component.html'
})
export class FooterComponent {
    today = Date.now();

    public showFooterLogos: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any
    ) { }
      
    public isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }
    public collapsed: boolean = true;

    showNumber(): void {
        this.collapsed = false;
    }
}
