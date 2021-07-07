import { isPlatformServer } from "@angular/common";
import { PLATFORM_ID, Injectable, Inject } from "@angular/core";

@Injectable()
export class ScrollService {

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    public scrollToElement(elementId: string): void {
        if (isPlatformServer(this.platformId)) {
            return;
        }
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ block: "start", inline: "nearest" });
        }
    }

    public scrollToElementMobile(elementId: string): void {
        let headerHeight = document.getElementsByClassName('header__holder')[0].getBoundingClientRect().height;
        let targetCoord = document.getElementById(elementId).offsetTop;
        let yCoord = targetCoord - headerHeight;
        window.scrollTo(0, yCoord);        
    }
}