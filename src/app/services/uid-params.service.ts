import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

    @Injectable()
    export class UidParams {
        private currentUid: string = '';
        private currentUnauthorizeUid: string = '';
        public uidIsSavedInGtag = false;
        private unauthorizeKey: string = 'unauthorizeKey';

        constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

        public setCurrentUid(param) {

            this.uidIsSavedInGtag = false;
            this.currentUnauthorizeUid = '';
            this.currentUid = param;
        }

        public getCurrentUid() {
 
            return this.currentUid;
        }

        public clearCurrentUid() {
            this.currentUid = '';
        }

        public setCurrentUnauthorizeUid(param) {

            if (!isPlatformBrowser(this.platformId)) {
                return;
            }

            if (!param) {
                return '';
            }
            if (this.currentUnauthorizeUid === param) {
                return;
            }

            if (this.currentUnauthorizeUid !== param) {

                this.uidIsSavedInGtag = false;
                localStorage.removeItem(this.unauthorizeKey);
                localStorage.setItem(this.unauthorizeKey, param);
                this.currentUnauthorizeUid = param;
                return;
            }
            this.currentUnauthorizeUid = param;
        }

        public getCurrentUnauthorizeUid() {

            if (!isPlatformBrowser(this.platformId)) {
                return;
            }

            let uidResult = this.currentUnauthorizeUid;

            if (!uidResult) {
                let localUid = localStorage.getItem(this.unauthorizeKey);
                if (localUid) {

                    this.currentUnauthorizeUid = localUid;
                }
                return this.currentUnauthorizeUid;
            }
            return this.currentUnauthorizeUid;
        }

        public clearCurrentUnauthorizeUid() {
            this.currentUnauthorizeUid = '';
        }
    }