import { Component, Inject, OnDestroy, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ServerParamsTransfer } from '../../server-params-transfer.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation.service';
import { SearchParametersService } from '../../services/search-parameters.service';
import { RoutingParametersService } from '../../services/routing-parameters.service';
import { LanguageService } from '../../services/language.service';
import { CatalogService } from '../../services/catalog-model.service';
import { Store } from '@ngrx/store';
import * as fromShopingCart from '../../shoping-cart/reducers';
import * as search from '../actions/search.actions';
import * as fromSearch from '../reducers';
import { SearchParameters } from '../models/search-parameters.model';
import { Product } from '../../models';
import { ScrollService } from '../../services/scroll.service';
import { GtagService } from '../../services/gtag.service';
import { RestStatusEnum } from '../models/rest-status-enum.model';
import { AreaService } from '../../location/area/area.service';
import * as fromFilters from '../../filters/reducers';

const headerHeight: number = 60;
const analogsElementId = "analogs";
const productsListElementId = "productsList";

@Component({
    selector: 'search-result',
    templateUrl: './__mobile__/search-result.component.html',
    styleUrls: ['./__mobile__/styles/search-result.component__.scss']
})
export class SearchResultComponent implements OnDestroy {
    public isList: boolean = false;
    public mode$: Observable<number>;
    public rest$: Observable<number>;
    public totalCount$: Observable<number>;
    public currentPage: number = 1;
    public searchParameters: SearchParameters;
    public queryParameters: Object = {};
    public mobileFiltersShown: boolean = false;
    public firstProduct$: Observable<Product>;
    public selectedFilterCount: number = 0;
    public firstFiveProducts: Product[] = [];
    public rtbHouseUrlForProducts: string = "";
    @ViewChild("selectedFilterView") selectedFilterView: ElementRef;
    @ViewChild("filters") filtersEl: ElementRef;
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    private scrollAllowed: boolean = true;


    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private serverParamsService: ServerParamsTransfer,
        private _searchParamsService: SearchParametersService,
        private _routeParamsService: RoutingParametersService,
        private _activatedRoute: ActivatedRoute,
        private _navigationService: NavigationService,
        private _areaService: AreaService,
        private _languageService: LanguageService,
        private _router: Router,
        private store: Store<fromShopingCart.State>,
        private searchStore: Store<fromSearch.State>,
        private _scrollService: ScrollService,
        private _gtagService: GtagService,
        private _catalogService: CatalogService,
        private filterStore: Store<fromFilters.State>
    ) {
        this._catalogService.getCatalogTreeModel().subscribe();
        this.mode$ = this.searchStore.select(fromSearch.getSelectedFormFactor);
        this.rest$ = this.searchStore.select(fromSearch.getIsRest);
        this.totalCount$ = this.searchStore.select(fromSearch.getTotalCount);

        this._router.events.pipe(takeUntil(this._destroy$)).subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.mobileFiltersShown = false;
                this.initialize();
            }
        });

        this.firstProduct$ = this.searchStore.select(fromSearch.getFirstProduct);
        this.searchStore.select(fromSearch.getFirstFiveProducts).pipe(takeUntil(this._destroy$)).subscribe(firstFiveProducts => {
            if (firstFiveProducts.length && this.isFirstFiveProductsChanged(firstFiveProducts)) {
                this.firstFiveProducts = firstFiveProducts;                
            }
        });
        this.searchStore.select(fromSearch.getLoadState).pipe(takeUntil(this._destroy$)).subscribe(loaded => {
            if (!loaded || this.IsMobile()) {
                return;
            }
            if (!this.scrollAllowed) {
                this.scrollAllowed = true;
                return;
            }
            this._scrollService.scrollToElement(productsListElementId);
        });

        this.filterStore.select(fromFilters.getAppliedOptions)
            .pipe(takeUntil(this._destroy$))
            .subscribe(result => {
                this.selectedFilterCount = result.length ? result.length : 0;
            });
    }

    public initialize() {
        this.cancelSearch();

        let params = this._activatedRoute.snapshot.queryParams;
        this.currentPage = Number(params["page"]) || 1;
        this.searchParameters = this._searchParamsService.getSearchParameters(params);
        this.store.dispatch(new search.SetSearchParameters(this.searchParameters));
        this._routeParamsService.getRoutingParameters(params).pipe(first()).subscribe(params => {
            this.queryParameters = params.queryParameters;
        });
        this.setSearchAutocomplete();
        this.search();

        this._areaService.areaChanged.pipe(takeUntil(this._destroy$)).subscribe(area => {
            this.store.dispatch(new search.SetNearestStoreAction(area.nearestStoreAreaKey));
            this.store.dispatch(new search.UpdateRestStatuses());
        });

        this._languageService.languageChange.pipe(takeUntil(this._destroy$)).subscribe(lng => {
            this.searchStore.dispatch(new search.SetSelectedLanguage(lng.name));
            this.searchStore.dispatch(new search.PerformDescriptionsTranslation());
        });
    }

    public ngOnDestroy() {
        this.cancelSearch();
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    public setIsList(isList: boolean) {
        this.isList = isList;
    }

    public search() {
        this.searchStore.dispatch(new search.SearchAction());
    }

    public cancelSearch() {
        this.searchStore.dispatch(new search.CancelSearchAction());
    }

    public navigate() {
        let params = this._activatedRoute.snapshot.params;
        this._routeParamsService.getRoutingParameters(params).pipe(first()).subscribe(routingParameters => {
            this._navigationService.NavigateWithQueryParams(['search-result'], routingParameters.queryParameters);
        })
    }

    public setFormFactor(event) {
        let value = +event.target.value;
        this.searchStore.dispatch(new search.SetFormFactor(value));
    }

    public setIsRest(event) {
        let isRest = event.target.checked ? 1 : 0;
        this.searchStore.dispatch(new search.SetRest(isRest));
    }

    public pageChanged(page: any) {
        this._searchParamsService.pageChanged(page);
        this.navigate();

    }

    private setSearchAutocomplete() {
        if (isPlatformBrowser(this.platformId)) {
            document.getElementById('search-autocomplete')['value'] = this.searchParameters.searchPhrase;
        }
    }

    public IsMobile() {
        return this.serverParamsService.serverParams.isMobileDevice;
    }

    public toggleFilters() {
        this.mobileFiltersShown = !this.mobileFiltersShown;
    }

    public applyFilters() {
        this.searchStore.dispatch(new search.SetFromField(0));

        this.navigate();
        this.closeFiltersAndNavigateMobile();
    }

    public resetFilters() {
        this.searchStore.dispatch(new search.ResetFilterOption())
        this.navigate();
        this.closeFiltersAndNavigateMobile();
    }

    public isShowMoreDisplayed(): Observable<boolean> {
        return this.totalCount$.pipe(map(total => {
            let isLast = Math.ceil(total / this.searchParameters.count) == this.currentPage;
            return Boolean(((this.searchParameters.from + this.searchParameters.count) < total) && !isLast)
        }));
    }

    public loadMoreProducts(): void {
        this.scrollAllowed = false; //block next scroll to search results
        this.searchStore.dispatch(new search.LoadMoreProducts());
        this.currentPage++;
    }

    public navigateToSelectedFilterView() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        let hidenElementHight = this.filtersEl ? this.filtersEl.nativeElement.offsetHeight : 0;
        let topOfElement = this.selectedFilterView.nativeElement.offsetTop - hidenElementHight - headerHeight;
        setTimeout(() => {
            window.scroll({ top: topOfElement, behavior: "smooth" });
        }, 500)
    }

    public closeFiltersAndNavigateMobile() {
        this.mobileFiltersShown = false;
        if (this.IsMobile()) {
            this.navigateToSelectedFilterView();
        }
    }

    public onAnalogsListChange(analogs: Product[]): void {
        if (!analogs || !analogs.length) {
            return;
        }

        this.firstProduct$.pipe(first()).subscribe(product => {
            if (!product) {
                return;
            }

            if (product.restStatus === RestStatusEnum.NotAvailable) {
                if (this.IsMobile() && this.scrollAllowed) {
                    this._scrollService.scrollToElementMobile(analogsElementId);
                    this.scrollAllowed = false;
                } else if (this.scrollAllowed) {
                    this._scrollService.scrollToElement(analogsElementId);
                    this.scrollAllowed = false;
                }
            }

            let prodIds: number[] = [product.id, ...analogs.map(a => a.id)];
            this._gtagService.sendSearchEventToAdWords(prodIds);
        })
    }

    private isFirstFiveProductsChanged(firstFiveProductIds: Product[]) {
        let oldIds = this.firstFiveProducts.map(x => x.id);
        let newIds = firstFiveProductIds.map(x => x.id);
        if (newIds.length !== oldIds.length) {
            return true;
        }
        for (let item of newIds) {
            if (!oldIds.includes(item)) {
                return true;
            }
        }
        return false;
    }
}