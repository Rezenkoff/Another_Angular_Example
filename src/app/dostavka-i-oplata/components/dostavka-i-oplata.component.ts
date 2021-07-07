import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollService } from '../../services/scroll.service';

@Component({
    selector: 'dostavka-i-oplata',
    templateUrl: './__mobile__/dostavka-i-oplata.component.html'
})
export class DostavkaIOplataComponent {

    private expectedFragment: string = "rabota-s-yuridicheskimi-litsami";
    public isScroll: boolean = false;

    constructor(
        private _scrollService: ScrollService,
        private _route: ActivatedRoute,
    ) {
        this._route.fragment.subscribe(fragment => { this.isScroll = fragment === this.expectedFragment; });
    }

    ngOnInit() {
        if (this.isScroll) {
            this.scroll();
        }
    }

    public scroll() {
        this._scrollService.scrollToElementMobile('scroll_anchor_dostavcaioplata');
    }
}
