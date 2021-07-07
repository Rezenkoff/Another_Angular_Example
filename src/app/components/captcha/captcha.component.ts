import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GCaptchaService } from '../../services/gcaptcha.service';

@Component({
    selector: 'autodoc-captcha',
    templateUrl: './__mobile__/captcha.component.html'
})
export class AutodocCapthcaComponent implements OnInit {

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _gcaptchaService: GCaptchaService,
        private _location: Location,
        private _activatedRoute: ActivatedRoute
    ) {
    }

    public ngOnInit() {

    }

    public resolved(captchaResponse: string) {
        let blockerKey = this._activatedRoute.snapshot.params['blockerKey'];
        let mainBlockerKey = this._activatedRoute.snapshot.params['mainBlockerKey'];

        this._gcaptchaService.verifyCaptcha(captchaResponse, mainBlockerKey, blockerKey).subscribe(response => {
            this._location.back();
        });

    }
}
