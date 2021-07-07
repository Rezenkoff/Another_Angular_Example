import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Component({
    selector: 'error-404',
    templateUrl: './__mobile__/404.component.html'
})
export class Error404Component {

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        meta: Meta,
    ) {
        if (isPlatformServer(platformId)) {
            meta.addTag({ name: 'STATUS_CODE_404' });
        }
    }
}
