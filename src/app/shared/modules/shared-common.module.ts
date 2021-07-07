/*MODULES*/
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input'; 
import { McBreadcrumbsModule } from '../../breadcrumbs/mc-breadcrumbs.module';
import { McBreadcrumbsService } from '../../breadcrumbs/service/mc-breadcrumbs.service';
import { McBreadcrumbsConfig } from '../../breadcrumbs/service/mc-breadcrumbs.config';
import { TranslateModule } from '../../translate/translate.module';
import { LiqPayModule } from '../../payment/liqpay/liqpay.module';

/*COMPONENTS*/
import { AutodocBreadcrumbsComponent } from '../components/autodoc-breadcrumbs.component';
import { AutodocPagingComponent } from '../components/paging.component';
import { MiniSpinnerComponent } from '../components/mini-spinner.component';
import { OrderDetailsComponent } from '../components/order-details.component';
import { OrderDetailsWithoutPopupComponent } from '../components/order-details-without-popup.component';
import { SearchHelpCallbackComponent } from '../components/search-help-callback/search-help-callback.component';
import { SvgReferenceDirective } from '../../shared/directives/svg.directive';
import { APP_CONSTANTS, app_constants } from '../../config';
import { BaseBlockComponent } from '../abstraction/base-block.component';
import { ShowPointOnMapPopupComponent } from '../components/show-point-on-map-popup.component';

/*SERVICES, PIPES, DIRECTIVES*/
import { SpecialPropositionsService } from '../../services/special-propositions.service';
import { AuthErrorService } from '../../auth/auth-error.service';
import { AuthHttpService } from '../../auth/auth-http.service';
import { OrderStepService } from '../../order-step/order-step.service';
import { AdminGuard } from '../guards/admin-guard';
import { ManagerGuard } from '../guards/manager-guard';
import { OnlyNumber } from '../../shared/directives/only-number.directive';
import { KeysPipe } from '../../shared/pipes/object-keys.pipe';
import { FilterPipe } from '../../shared/pipes/filter';
import { TranslateService } from '../../translate/translations/translate.service';
import { OrderService } from '../../services/order.service';
import { SortService } from '../../services/sort.service';
import { LinkService } from '../../services/link.service';
import { SearchParametersService } from '../../services/search-parameters.service';
import { RoutingParametersService } from '../../services/routing-parameters.service';
import { SpriteSpinService } from '../../services/spritespin.service';
import { LiqpayService } from '../../payment/liqpay/liqpay.service';
import { ExceptionService } from '../../services/exception.service';
import { NavigationService } from '../../services/navigation.service';
import { ALERT_TRANSLATIONS, translations } from '../../translate/custom/alert-translation';
import { LAXIMO_TRANSLATIONS, laximo_translations } from '../../translate/custom/laximo-translations';
import { VinSearchComponent } from '../components/vin-search.component';
import { LoggerService } from '../../logger/services/logger.service';
import { JcfDirective } from '../directives/jcf.directive';
import { FocusDirective } from '../directives/focus.directive';
import { CustomSwipeDirective } from '../directives/swipe.directive';
import { UploadService } from '../../services/upload.service';
import { SeoGuard } from '../guards/seo-guard';
import { AgmCoreModule } from '@agm/core';
import { PolisService } from '../../polis/polis.service';
import { EmployeeGuard } from '../guards/employee-guard';
import { McBreadCrumbsFilteredService } from '../../breadcrumbs/service/mc-breadcrumbs-filtered.service';
import { CarCatalogService } from '../../cars-catalog/services/car-catalog.service';
import { ContentManagerGuard } from '../guards/content-manager-guard';
import { BrandsCatalogService } from '../../brands-catalog/service/brands-catalog.service';
import { AddVehicleMyGarageComponent } from '../../vehicle/components/add-vehicle-mygarage.component';
import { CarSelectPanelGarageComponent } from '../../car-select-panel/components/car-select-panel-garage.component';
import { FilterDropdownGarageComponent } from '../../filters/components/filter-dropdown-garage.component';
import { CarSelectTiresComponent } from '../../promo-slider/components/car-select-tires.component';
import { CarSelectPanelCommonComponent } from '../../car-select-panel/components/car-select-panel.component';
import { CarSelectPanelTiresComponent } from '../../car-select-panel/components/car-select-panel-tires.component';
import { FiltersSharedModule } from './filters.shared.module';
import { DeliveryPointMapComponent } from '../../delivery/points/delivery-point-map.component';
import { AgmMarkerClustererModule } from '@agm/markerclusterer';
import { CurrencyFormatPipe } from '../pipes/currency-format.pipe';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatInputModule,
        TranslateModule,
        McBreadcrumbsModule,
        MatDialogModule,
        LiqPayModule,
        AgmCoreModule,
        AgmMarkerClustererModule,
        FiltersSharedModule
    ],
    declarations: [
        SvgReferenceDirective,
        JcfDirective,
        CustomSwipeDirective,
        OnlyNumber,
        KeysPipe,
        FilterPipe,
        MiniSpinnerComponent,
        FocusDirective,
        VinSearchComponent,
        SearchHelpCallbackComponent,
        AutodocBreadcrumbsComponent,
        AutodocPagingComponent,
        OrderDetailsComponent,
        OrderDetailsWithoutPopupComponent,
        BaseBlockComponent,
        ShowPointOnMapPopupComponent,
        AddVehicleMyGarageComponent,
        CarSelectPanelGarageComponent,
        FilterDropdownGarageComponent,
        DeliveryPointMapComponent,
        CurrencyFormatPipe
    ],
    exports: [
        SvgReferenceDirective,
        JcfDirective,
        CustomSwipeDirective,
        OnlyNumber,
        KeysPipe,
        FilterPipe,
        FormsModule,
        RouterModule,
        CurrencyFormatPipe,
        McBreadcrumbsModule,
        TranslateModule,
        MatTooltipModule,
        MatInputModule,
        ReactiveFormsModule,
        MiniSpinnerComponent,
        AutodocPagingComponent,
        FocusDirective,
        VinSearchComponent,
        SearchHelpCallbackComponent,
        AutodocBreadcrumbsComponent,
        OrderDetailsComponent,
        OrderDetailsWithoutPopupComponent,
        BaseBlockComponent,
        ShowPointOnMapPopupComponent,
        DeliveryPointMapComponent,
        AddVehicleMyGarageComponent,
        CarSelectPanelGarageComponent,
        FilterDropdownGarageComponent
    ],
    entryComponents: [VinSearchComponent]
})
export class SharedCommonModule {
    static forRoot(): ModuleWithProviders<SharedCommonModule> {
        return {
            ngModule: SharedCommonModule,
            providers: [
                { provide: APP_CONSTANTS, useValue: app_constants },
                { provide: ALERT_TRANSLATIONS, useValue: translations },
                { provide: LAXIMO_TRANSLATIONS, useValue: laximo_translations },
                ExceptionService,
                NavigationService,
                CarCatalogService,
                McBreadCrumbsFilteredService,
                McBreadcrumbsService,
                McBreadcrumbsConfig,                
                AdminGuard,
                ManagerGuard,
                SeoGuard,
                ContentManagerGuard,
                EmployeeGuard,
                AuthErrorService,
                AuthHttpService,
                TranslateService,
                LoggerService,
                OrderStepService,
                SpecialPropositionsService,
                OrderService,
                LiqpayService,
                SortService,
                SpriteSpinService,
                LinkService,
                SearchParametersService,
                RoutingParametersService,
                UploadService,
                PolisService,
                BrandsCatalogService,
            ]
        };
    }
}