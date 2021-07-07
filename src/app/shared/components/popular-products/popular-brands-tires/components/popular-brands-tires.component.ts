import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Product } from '../../../../../models';
import { BaseListComponent } from '../../../../abstraction/search-base-list.component';
import { IAppConstants, APP_CONSTANTS } from '../../../../../config';
import { Store } from '@ngrx/store';
import { SearchService } from '../../../../../services/search.service';
import { NavigationService } from '../../../../../services/navigation.service';
import { FavoriteProductService } from '../../../../../services/favorite-product.service';
import { PixelFacebookService } from '../../../../../services/pixel-facebook.service';
import { AuthHttpService } from '../../../../../auth/auth-http.service';
import { MatDialog } from '@angular/material/dialog';
import { GtagService } from '../../../../../services/gtag.service';
import * as fromShopingCart from '../../../../../shoping-cart/reducers';
import * as fromSearch from '../../../../../search/reducers';
import { Subscription } from 'rxjs';
import { SearchParameters } from '../../../../../search/models';


@Component({
    selector: 'popular-brands-tires',
    templateUrl: './__mobile__/popular-brands-tires.component.html',
    styleUrls: ['./__mobile__/styles/popular-brands-tires.component__.scss']
})
export class PopularBrandsTiresList extends BaseListComponent implements OnInit, OnDestroy {

    public subscriptions: Array<Subscription> = new Array<Subscription>();
    public products: Product[];
    public searchParameters: SearchParameters = new SearchParameters();

    constructor(
        @Inject(APP_CONSTANTS) private __appconstants: IAppConstants,
        @Inject(PLATFORM_ID) private _platformId,
        private __store: Store<fromShopingCart.State>,
        private __searchStore: Store<fromSearch.State>,
        private __searchService: SearchService,
        private __navigationService: NavigationService,
        public _favoriteProductService: FavoriteProductService,
        public _authHttpService: AuthHttpService,
        public _dialog: MatDialog,
        public _gtagService: GtagService,
        public _facebookPixelService: PixelFacebookService
    ) {
        super(__store, __searchStore, __searchService, __navigationService, _favoriteProductService, _authHttpService, _dialog, _gtagService, _facebookPixelService);
    }

    ngOnInit() {
        this.searchParameters.categoryUrl = 'shiny-id49-3';
        this.searchParameters.formFactor = -2;
        this.searchParameters.selectedCategory = 'tires';
        this.searchParameters.sortOrder = 1;
        this.searchParameters.artId = 0;
        this.searchParameters.count = 30;

        let res = this.__searchService.searchWithGenericFilter(this.searchParameters);
        res.subscribe(data => {    
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
