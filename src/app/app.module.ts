/*MODULES*/
import { NgModule, Injectable, APP_INITIALIZER, PLATFORM_ID } from '@angular/core';
import { PrebootModule } from 'preboot';
import { BrowserModule, BrowserTransferStateModule, ɵgetDOM } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedCommonModule } from './shared/modules/shared-common.module';
import { SharedShopingCartModule } from './shared/modules/shared-shoping-cart.module';
import { GoogleMapsModule } from './google-maps/google-maps.module';
import { LocationModule } from './location/location.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './redux-store/reducers';
import { RecaptchaModule } from 'ng-recaptcha';
import { AgmCoreModule } from '@agm/core';
import { VehicleModule } from './vehicle/vehicle.module';
import { TransferHttpCacheModule  } from '@nguniversal/common';
import { SeoModule } from './seo/seo.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { DeferLoadModule } from './defer-loader/defer-load.module';
import { QuicklinkModule } from 'ngx-quicklink';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { PopularProductsModule } from './shared/components/popular-products/popular-products.module';
import { PromoSliderModule } from './promo-slider/promo-slider.module';
import { SparePartSelectModule } from './spare-part-select/spare-part-select.module';
import { DeliveryPointModule } from './delivery/points/delivery-point.module';

/*COMPONENTS*/
import { InlineStylesComponent } from "./app-root/inline-style/inline-styles.component";
import { CallbackComponent } from "./components/header/callback.component";
import { MyGarageComponent } from "./components/header/my-garage.component";
import { WorkingHoursComponent } from "./components/header/working-hours.component";
import { SubscriptionComponent } from "./containers/footer/subscription.component";
import { FooterComponent} from "./containers/footer/footer.component";
import { AppComponent } from "./app-root/app.component";
import { HeaderComponent } from "./components/header/header.component";
import { HomeComponent } from "./components/home/home.component";
import { Error500Component } from "./components/errors/500/500.component"; 
import { Error405Component } from "./components/errors/405/405.component";
import { Error404Component } from "./components/errors/404/404.component";
import { Error403Component } from "./components/errors/403/403.component";
import { SpecPropComponent } from "./components/specialprop/specialprop.component"; 
import { AllNewsComponent } from "./components/news/all-news.component"; 
import { NewsComponent } from "./components/news/news.component";
import { AlertComponent } from "./shared/components/alert.component";
import { SearchComponent } from "./components/header/search.component";
import { AutodocCapthcaComponent } from "./components/captcha/captcha.component"; 
import { MobileCallbackComponent } from "./components/header/mobile-callback.component"; 
import { CatalogPopupComponent } from "./components/catalog/catalog-popup.component"; 
import { CatalogLevelComponent } from "./components/catalog/catalog-level.component"; 
import { CatalogListComponent } from "./components/catalog/catalog-list.component";
import { CatalogTypeSelectComponent } from "./components/catalog/catalog-type-select.component";
import { CallbackPopupComponent } from "./components/header/callback-popup.component";
import { PolisAutodocComponent } from "./components/polis/polis-autodoc.component";
import { ArrowUpComponent } from "./containers/footer/arrow-up/arrow-up.component";
import { StatusComponent } from "./components/status/status.component";

/*SERVICES, PIPES*/
import { CdnImageHelper } from './app-root/cdn-image-path';
import { MainSeoEventHandler } from './app-root/main-seo-worker';
import { MainUrlParser } from './app-root/main-url.parser';
import { CatalogBreadcrumbsResolver } from './app-routing/catalog-breadcrumbs.resolver';
import { ProductBreadcrumbsResolver } from './app-routing/product-breadcrumb.resolver';
import { CookieService } from 'ngx-cookie-service';
import { NewsService } from "./services/news.service";
import { LanguageService } from "./services/language.service";
import { SearchService } from  "./services/search.service";
import { UserStorageService } from "./services/user-storage.service";
import { UtmService } from "./services/utm.service";
import { OrderService } from "./services/order.service";
import { AlertService } from "./services/alert.service";
import { SeoTagsService } from "./services/tags.service";
import { SubscriptionService } from "./services/subscription.service";
import { BitrixService } from "./services/bitrix.service";
import { VinSearchService } from "./services/vinsearch.service";
import { CatalogService } from "./services/catalog-model.service";
import { GCaptchaService } from "./services/gcaptcha.service";
import { FavoriteProductService } from "./services/favorite-product.service";
import { ProductInfoStorageService } from "./services/product-info-storage.service";
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BannersService } from './services/banners.sevice';
import { AreaService } from './location/area/area.service';
import { PixelFacebookService } from './services/pixel-facebook.service';
import { UidParams } from './services/uid-params.service';
import { FiltersService } from './filters/services/filters.service';
import { StoService } from './sto/sto.service';
import { LocationService } from './location/location.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ServerParamsTransfer } from './server-params-transfer.service';
import { GlobalTransportService } from './services/global-flag.service';
import { ScrollService } from './services/scroll.service';
import { AuthForgotPassTimeService } from './services/auth-forgot-pass-time.service';

/*INTERCEPTORS*/
import { HttpAuthInterceptor } from './app-root/interceptors/http-auth.interceptor';
import { HttpRequestHeaderInterceptor } from './app-root/interceptors/http-request-header.interceptor';
import { BrowserStateInterceptor } from './app-root/interceptors/browser-state.interceptor';

declare var Hammer: any;

@Injectable()
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

@NgModule({
    declarations: [       
        AppComponent,
        InlineStylesComponent,
        HeaderComponent,
        SearchComponent,
        CallbackComponent,
        StatusComponent,
        MyGarageComponent,
        WorkingHoursComponent,
        FooterComponent,
        HomeComponent,
        SpecPropComponent,
        Error500Component,
        Error404Component,
        Error405Component,
        AutodocCapthcaComponent,
        AlertComponent,
        AllNewsComponent,
        NewsComponent,
        SubscriptionComponent,
        Error403Component,
        MobileCallbackComponent,
        CatalogPopupComponent,
        CatalogLevelComponent,
        CatalogListComponent,
        CatalogTypeSelectComponent,
        CallbackPopupComponent,
        PolisAutodocComponent,
        ArrowUpComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule.withServerTransition({
            appId: 'autodoc-app-ssr' 
        }),
        PrebootModule.withConfig({ appRoot: 'app-root' }),
        HttpClientModule,
        BrowserAnimationsModule,     
        BrowserTransferStateModule,
        TransferHttpCacheModule,
        AccordionModule.forRoot(),
        SharedCommonModule.forRoot(),
        SharedShopingCartModule,
        GoogleMapsModule,
        VehicleModule,
        LocationModule,        
        EffectsModule.forRoot([]),
        StoreModule.forRoot(reducers, {
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false,
            },
          }),
        RecaptchaModule,
        AgmCoreModule.forRoot({ apiKey: 'AIzaSyDyMov6XfGCvrwpZIStJHDLyNdYpZKjFnI' }),
        //AgmCoreModule.forRoot({ apiKey: 'AIzaSyBwZCbxmC1FdisG6BKUgTC9QzKwl3P2aF4' }), //for dev 
        SeoModule.forRoot(),       
        PopularProductsModule,
        CarouselModule.forRoot(),
        DeferLoadModule,
        SparePartSelectModule,
        PromoSliderModule,
        QuicklinkModule,
        DeliveryPointModule,
 
    ],
    providers: [
        UidParams,
        MainUrlParser,
        ServerParamsTransfer,
        PixelFacebookService,
        CdnImageHelper,
        SeoTagsService,
        UserStorageService,
        OrderService,
        SearchService,
        LanguageService, 
        NewsService, 
        AlertService, 
        SubscriptionService, 
        MainUrlParser, 
        MainSeoEventHandler, 
        VinSearchService,
        AreaService,
        CatalogService,
        GCaptchaService,
        CookieService,
        UtmService,
        BitrixService,
        { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
        CatalogBreadcrumbsResolver,
        ProductBreadcrumbsResolver,
        FavoriteProductService,
        BannersService,
        ScrollService,
        AuthForgotPassTimeService,
        ProductInfoStorageService,
        FiltersService,
        StoService,
        LocationService,
        GlobalTransportService,
        {
           provide: MatDialogRef,
           useValue: {}
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpAuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpRequestHeaderInterceptor,
            multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BrowserStateInterceptor,
          multi: true
        },        
        {
            provide: APP_INITIALIZER,
            useFactory: (platformId: object) => () => {
              if (isPlatformBrowser(platformId)) {
                const dom = ɵgetDOM();
                const styles = Array.prototype.slice.apply(
                  dom.getDefaultDocument().querySelectorAll('style[ng-transition]')
                );
                styles.forEach(el => {
                  // Remove ng-transition attribute to prevent Angular appInitializerFactory
                  // to remove server styles before preboot complete
                  el.removeAttribute('ng-transition');
                });
                dom.getDefaultDocument().addEventListener('PrebootComplete', () => {
                  // After preboot complete, remove the server scripts
                  styles.forEach(el => dom.remove(el));
                });
              }
            },
            deps: [PLATFORM_ID],
            multi: true,
          },
        ],
    bootstrap: [AppComponent],
    entryComponents: [CatalogPopupComponent]
})
export class AppModule { }
