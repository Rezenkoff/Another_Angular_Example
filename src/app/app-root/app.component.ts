import { Component, PLATFORM_ID, Inject, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { ISeoEventHandler, MainSeoEventHandler } from './main-seo-worker';
import * as svg4everybody from 'svg4everybody';
import * as Hammer from 'hammerjs';
import { HammerGestureConfig } from '@angular/platform-browser';
import { UserStorageService } from '../services/user-storage.service';
import { GlobalTransportService, ActionEvent } from '../services/global-flag.service';
import { ScriptService } from '../lazyloading/script.service';

declare var Hammer: any;

export class MyHammerConfig extends HammerGestureConfig {
   buildHammer(element: HTMLElement) {
       let options = {
           touchAction: "pan-y",
           cssProps: { userSelect: true }
       }
       let mc = new Hammer(element, options);
       return mc;
   }
}

@Component({
    selector: 'app-root',
    templateUrl: './__mobile__/app.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
   public showMobileMenu: boolean = true;

   constructor(      
      @Inject(PLATFORM_ID) private platformId: Object,
      @Inject(MainSeoEventHandler) private eventHandler: ISeoEventHandler,
      private storage: UserStorageService,
      private router: Router,
      private _transportService: GlobalTransportService,
      private _scripts: ScriptService,
   ) {
   }

   ngOnInit() {

      this.storage.checkUidParam();
      this.eventHandler.changeTitleOnNavigation(this.router);

      if (isPlatformBrowser(this.platformId)) {
          svg4everybody();
          this.router.events.subscribe((evt) => {
              if (!(evt instanceof NavigationEnd)) {
                  return;
              }
              window.scrollTo(0, 0);
          });
      }

      this._transportService.subscribeToGlobalTransport().subscribe(parcel => {

          if (parcel && parcel.typeFlag == ActionEvent.showOnlyMobileCabinet) {

              this.showMobileMenu = parcel.value;
          }
      });
  }

  ngAfterViewInit() {
      if (isPlatformBrowser(this.platformId)) {          
          this._scripts.load('google-tag-manager').then(data => { });
          this._scripts.load('crm-bitrix').then(data => { });
          this._scripts.load('facebook-pixel').then(data => { });
      }
  }

  public isBrowser(): Boolean {
      return isPlatformBrowser(this.platformId);
  }
}
