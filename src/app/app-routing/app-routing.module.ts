import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { StatusComponent } from '../components/status/status.component';
import { AllNewsComponent } from '../components/news/all-news.component';
import { NewsComponent } from '../components/news/news.component';
import { Error404Component } from '../components/errors/404/404.component';
import { Error500Component } from '../components/errors/500/500.component';
import { Error405Component } from '../components/errors/405/405.component';
import { Error403Component } from '../components/errors/403/403.component';
import { AutodocCapthcaComponent } from '../components/captcha/captcha.component';
import { PolisAutodocComponent } from '../components/polis/polis-autodoc.component';

//identificator should be given for all pages that we want to make seo frendly (499100000 to 500000000)
const appRoutes: Routes = [
    
    { path: '', component: HomeComponent, data: { identificator: 499100000, type: 1 } },
    { path: 'forbidden', component: Error403Component },
    { path: 'notfound', component: Error404Component },
    { path: 'method-not-allowed', component: Error405Component },
    { path: 'server-error', component: Error500Component },
    { path: 'polis-autodoc', component: PolisAutodocComponent },
    { path: 'captcha/:mainBlockerKey/:blockerKey', component: AutodocCapthcaComponent },
    { 
        path: 'authentication', 
        loadChildren: async () => (await import('../auth/auth.module')).AuthModule
    },
    { 
        path: 'about-company', 
        loadChildren: async () => (await import('../about-company/about-company.module')).AboutCompanyModule,
        data: { identificator: 499100001, type: 1 } 
    },
    { 
        path: 'contact',
        loadChildren: async () => (await import('../components/informative-pages/contact/contact.module')).ContactModule,
    },
    { 
        path: 'dostavka-i-oplata', 
        loadChildren: async () => (await import('../dostavka-i-oplata/dostavka-i-oplata.module')).DostavkaIOplataModule, 
        data: { identificator: 499100003, type: 1 } 
    },
    { 
        path: 'garantia-i-vozvrat', 
        loadChildren: async () => (await import('../garantia-i-vozvrat/garantia-i-vozvrat.module')).GarantiaIVozvratModule, 
        data: { identificator: 499100004, type: 1 } 
    },
    { 
        path: 'pomoch', 
        loadChildren: async () => (await import('../kak-zakazat/kak-zakazat.module')).KakZakazatModule, 
        data: { identificator: 499100005, type: 1 }
    },
    { 
        path: 'pravila-polzovania', 
        loadChildren: async () => (await import('../pravila-polzovania/pravila-polzovania.module')).PravilaPolzovaniaModule,
    },
    { 
        path: 'for-partners', 
        loadChildren: async () => (await import('../for-partners/for-partners.module')).ForPartnersModule,
    },
    // ////TODO: move to lazy loaded module
    { path: 'all-news', component: AllNewsComponent },
    { path: 'news/:id/:title', component: NewsComponent },

    { path: 's/:link', component: StatusComponent, data: { identificator: 499100010, type: 1 } },
    { path: 'find-by-vin', redirectTo: 'find-by-vin/base' },
    { 
        path: 'find-by-vin', 
        loadChildren: async () => (await import('../order-step/order-step.module')).OrderStepModule, 
    },
    { 
        path: 'order-main', 
        loadChildren: async () => (await import('../order-step/order-step.module')).OrderStepModule, 
    },
    { 
        path: 'sto', 
        loadChildren: async () => (await import('../sto/sto.module')).StoModule, 
    },
    { 
        path: 'contact/sto', 
        loadChildren: async () => (await import('../sto/sto.module')).StoModule, 
    },
    { 
        path: 'order-checkout', 
        loadChildren: async () => (await import('../shoping-cart/shoping-cart.module')).ShopingCartModule, 
    },
    { 
        path: 'find-by-auto', 
        loadChildren: async () => (await import('../find-by-auto/find-by-auto.module')).FindByAutoModule, 
    },
    { 
        path: 'detail-groups', 
        loadChildren: async () => (await import('../detail-groups/detail-groups.module')).DetailGroupsModule 
    },
    { 
        path: 'product/:urlEnding', 
        loadChildren: async () => (await import('../product/product.module')).ProductModule
    },
    { 
        path: 'search-result', 
        loadChildren: async () => (await import('../search/search.module')).SearchModule
    },
    { 
        path: 'analogs/:productId', 
        loadChildren: async () => (await import('../analogs/analogs.module')).AnalogsModule
    },
    { 
        path: 'cabinet', 
        loadChildren: async () => (await import('../cabinet/cabinet.module')).CabinetModule 
    },
    { 
        path: 'category', 
        loadChildren: async () => (await import('../catalog/catalog.module')).CatalogModule,
        data: { identificator: 0, type: 3 } 
    },
    { 
        path: 'category/:urlEnding', 
        loadChildren: async () => (await import('../catalog/catalog.module')).CatalogModule  
    },
    { 
        path: 'category/banner/:id', 
        loadChildren: async () => (await import('../catalog/catalog.module')).CatalogModule  
    },
    { 
        path: 'category/:urlEnding/:filter1', 
        loadChildren: async () => (await import('../catalog/catalog.module')).CatalogModule  
    },
    { 
        path: 'category/:urlEnding/:filter1/:filter2', 
        loadChildren: async () => (await import('../catalog/catalog.module')).CatalogModule
    },
    { 
        path: 'category/:urlEnding/:filter1/:filter2/:filter3', 
        loadChildren: async () => (await import('../catalog/catalog.module')).CatalogModule 
    },
    { 
        path: 'category/:urlEnding/:filter1/:filter2/:filter3/:filter4', 
        loadChildren: async () => (await import('../catalog/catalog.module')).CatalogModule
    },
    { 
        path: 'cars-catalog', 
        loadChildren: async () => (await import('../cars-catalog/cars-catalog.module')).CarsCatalogModule, 
        data: { identificator: 499100011, type: 1 } 
    },
    { 
        path: 'brands-catalog', 
        loadChildren: async () => (await import('../brands-catalog/brands-catalog.module')).BrandsCatalogModule, 
        data: { identificator: 499100012, type: 1 } 
    },
    { 
        path: 'refund-main', 
        loadChildren: async () => (await import('../refund-step/refund-step.module')).RefundStepModule 
    },
    { path: '**', redirectTo: 'notfound' }
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            useHash: false,
            initialNavigation: 'enabled'
        })
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule { }