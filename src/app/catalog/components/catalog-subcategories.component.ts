import { Component, Input, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { SeoTagsService } from '../../services/tags.service';
import { LinkService } from '../../services/link.service';
import { SearchParametersService } from '../../services/search-parameters.service';
import { RoutingParametersService } from '../../services/routing-parameters.service';
import { NavigationService } from '../../services/navigation.service';
import { LanguageService } from '../../services/language.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ServerParamsTransfer } from '../../server-params-transfer.service';
import { Node } from '../models/node.model';
import * as search from '../../search/actions/search.actions';
import * as fromFilters from '../../filters/reducers';
import * as fromSearch from '../../search/reducers';
import { Store } from '@ngrx/store';
import { SearchParameters } from '../../search/models/search-parameters.model';
import { Observable, Subject } from 'rxjs';
import { first, takeUntil, map } from 'rxjs/operators';
import { GtagService } from '../../services/gtag.service';
import { ScrollService } from '../../services/scroll.service';
import { AreaService } from '../../location/area/area.service';
import { CatalogType } from '../models/catalog-type.enum';

const headerHeight: number = 60;
const productsListElementId: string = "productsList";

@Component({
    selector: 'catalog-subs',
    templateUrl: './__mobile__/catalog-subcategories.component.html',
    styleUrls: ['./__mobile__/styles/catalog-subcategories.component__.scss']
})

export class CatalogSubCategoriesComponent implements OnDestroy, OnInit {

    public id: string = 'catalog-subs';
    public href: string = '#catalog-subs';
    public isCategoryPage: boolean = true;
    public carFiltersPanelShow: boolean;
    public selectedFilterCount: number = 0;

    @Input() root$: Observable<Node> = new Observable<Node>();
    //use only when root element shoud be fourth lvl node
    @Input()
    public fourthLvlRoot: Node = null;
    @Input()
    public catalogType: CatalogType = CatalogType.Passenger;
    @Input()
    public categoryTitle: string = '';

    public rootParentNode: Node = new Node();
    public isList: boolean = false;
    public pageText: string = '';
    public totalCount$: Observable<number>;
    public loadInSearch$: Observable<boolean>;
    public currentPage: number = 1;
    public searchParameters: SearchParameters = new SearchParameters();
    public isOilCategoryAndShowVideo: boolean = false;
    public showBottomText: boolean = false;
    public selectedFilters: Object;
    private catalogNodeName: string;
    private seoTextDisplayed: boolean = false;
    private seoTextCategoryDisplayed: boolean = false;
    private queryParameters: Object = {};
    private mobileFiltersShown: boolean = false;
    private isBanner: boolean = false;
    private showFilters: boolean = false;
    private currentRouteParams: any = null;
    private searchRequestNeeded: boolean = false;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private subcategoriesIsShown: boolean = true;
    @ViewChild("selectedFilterViewMobile") selectedFilterView: ElementRef;
    @ViewChild("filtersMobile") filtersEl: ElementRef;
    private scrollAllowed: boolean = true;
    private _prevSearchParamsJson: string = "";
    private _initialized = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _serverParamsService: ServerParamsTransfer,
        private _searchStore: Store<fromSearch.State>,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _tagsService: SeoTagsService,
        private _linkService: LinkService,
        private _searchParamsService: SearchParametersService,
        private _routingParamsService: RoutingParametersService,
        private _navigationService: NavigationService,
        private _gtagService: GtagService,
        private _scrollService: ScrollService,
        private _areaServuce: AreaService,
        private _languageService: LanguageService,
        private filterStore: Store<fromFilters.State>,
    ) {
    }

    ngOnInit() {

        this.root$.pipe(takeUntil(this.destroy$)).subscribe(node => {
            this.rootParentNode = node;
            this.mobileFiltersShown = false;
            this.initialize();
        });
        this.totalCount$ = this._searchStore.select(fromSearch.getTotalCount);
        this.totalCount$.pipe(takeUntil(this.destroy$)).subscribe(total => {
            let ignoredTags = [];
            if (!(this.isOnThirdLevelOfCatalog() || this.isSecondWithoutFourth())) {
                ignoredTags = ['next', 'prev'];
            }
            this._linkService.buildSEOlinks(total, '', ignoredTags);
        });
        this._router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.initialize();
            }
        })
        this.loadInSearch$ = this._searchStore.select(fromSearch.getLoadState);
        this.loadInSearch$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
            if (loading) {
                return;
            }

            if (!this.scrollAllowed) {
                this.scrollAllowed = true;
                return;
            }

            if (!this.IsMobile()) {
                this._scrollService.scrollToElement(productsListElementId);
            }
        });
        this._areaServuce.areaChanged.pipe(takeUntil(this.destroy$)).subscribe(area => {
            this._searchStore.dispatch(new search.SetNearestStoreAction(area.nearestStoreAreaKey));
            this._searchStore.dispatch(new search.UpdateRestStatuses());
        });
        this._languageService.languageChange.pipe(takeUntil(this.destroy$)).subscribe(lng => {
            this._searchStore.dispatch(new search.SetSelectedLanguage(lng.name));
            this._searchStore.dispatch(new search.PerformDescriptionsTranslation());
        });
        this.filterStore.select(fromFilters.getAppliedOptions)
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
                this.selectedFilterCount = result.length ? result.length : 0;
            });
        this.filterStore.select(fromFilters.getFiltersDict).pipe(takeUntil(this.destroy$)).subscribe(result => {
            this.selectedFilters = result;
        })
    }

    ngOnDestroy() {
        this.cancelSearch();
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this._linkService.clearSEOlinks();
    }

    private initialize() {
        let queryParams = this._activatedRoute.snapshot.queryParams;
        let params = this._activatedRoute.snapshot.params;
        this.currentRouteParams = params;
        this.currentPage = Number(queryParams["page"]) || 1;
        this.setIsBanner(queryParams);
        this.catalogNodeName = params['urlEnding'];
        this.searchParameters = this._searchParamsService.getSearchParameters(queryParams, this.catalogNodeName, params);

        const currentSearchParamsJson: string = JSON.stringify(this.searchParameters);
        if (this._initialized && currentSearchParamsJson == this._prevSearchParamsJson) {
            return;
        }

        this._searchStore.dispatch(new search.SetSearchParameters(this.searchParameters));
        this._routingParamsService.getRoutingParameters(params).pipe(takeUntil(this.destroy$), first()).subscribe(params => {
            this.queryParameters = params.queryParameters;
        });
        this.loadPageText(params);
        this.setSearchAutocomplete();
        this.initFilters();
        this.searchRequestNeeded = (this.isSecondWithoutFourth() || this.isOnThirdLevelOfCatalog());
        this.cancelSearch();
        this._prevSearchParamsJson = currentSearchParamsJson;
        this.search();
        this._initialized = true;

        this.seoTextCategoryDisplayed = (params['urlEnding'] == undefined ? true : false);
        this.carFiltersPanelShow = (params['urlEnding'] == "shiny-id49-3" ? false : true);
        this.isOilCategoryAndShowVideo = (params['urlEnding'] == "motornoe-maslo-id40-3" ? true : false);
    }

    public pageChanged(page: any) {
        this._searchParamsService.pageChanged(page);
        this.navigate();
    }

    public loadPageText(params: any) {
        if (this.containsFilterParameters(params)) {
            if (this.isNeedCheckBrandFilterText(params)) {
                this.loadBrandCategoryText(params);
            }
            else this.pageText = "";
        } else {

            this._tagsService.GetSeoPageByUrlEnding(this.catalogNodeName)
                .pipe(takeUntil(this.destroy$)).subscribe(text => {
                    this.pageText = text;
                    this.seoTextDisplayed = this.isPageTextDisplayed();
                });

        }
    }
    public isNeedCheckBrandFilterText(params: any) {
        var t = (this.queryParameters["queryParams"]["formFactor"] == null && params["filter1"] != null)
        return t;

    }

    public loadBrandCategoryText(params: any) {
        this._tagsService.GetTextcategoryBrand(this.catalogNodeName, params["filter1"].valueOf())
            .pipe(takeUntil(this.destroy$)).subscribe(text => {
                this.pageText = text;
                this.seoTextDisplayed = this.isPageTextDisplayed();
            });
    }
    public setIsList(isList: boolean) {
        this.isList = isList;
    }

    public isOnThirdLevelOfCatalog(): boolean {
        return this.rootParentNode && this.rootParentNode.deepLevel == 3
    }

    public isSecondWithoutFourth(): boolean {
        return this.rootParentNode && this.rootParentNode.deepLevel == 2 && !this.rootParentNode.children.some(node => node.hasChildren);
    }

    public isRoot(fourthLevelNodeId: number): string {
        return this.fourthLvlRoot && this.fourthLvlRoot.nodeId == fourthLevelNodeId ? 'active' : '';
    }

    public search(): void {
        if (!this.searchRequestNeeded) {
            this._gtagService.sendForCategoryWithoutProducts();
            return;
        }
        this._searchStore.dispatch(new search.SearchAction());
    }

    public cancelSearch() {
        this._searchStore.dispatch(new search.CancelSearchAction());
    }

    public navigate() {
        let params = this._activatedRoute.snapshot.params;
        this._routingParamsService.getRoutingParameters(params).pipe(takeUntil(this.destroy$), first()).subscribe(
            parameters => this._navigationService.NavigateWithQueryParams(parameters.route, parameters.queryParameters)
        );
    }

    public isPageTextDisplayed(): boolean {
        let result: boolean = false;
        if (this.pageText
            && this.currentPage == 1
            && !this.searchParameters.sortField
            //&& (!this.searchParameters.cartManufacturers || this.searchParameters.cartManufacturers.length === 0)
            && (!this.searchParameters.carModels || this.searchParameters.carModels.length === 0)
            && (!this.searchParameters.carTypes || this.searchParameters.carTypes.length === 0)
        ) {
            result = true;
        }

        return result;
    }

    private setSearchAutocomplete() {
        if (isPlatformBrowser(this.platformId)) {
            document.getElementById('search-autocomplete')['value'] = this.searchParameters.searchPhrase;
        }
    }

    public IsMobile() {
        return this._serverParamsService.serverParams.isMobileDevice;
    }

    private setIsBanner(params: any): void {
        if (params && params['banner']) {
            this.isBanner = params['banner'];
            return;
        }
        this.isBanner = false;
    }

    public toggleFilters() {
        this.mobileFiltersShown = !this.mobileFiltersShown;
    }

    public applyFilters() {
        this._searchStore.dispatch(new search.SetFromField(0));
        this.navigate();
        this.closeFiltersAndNavigateMobile();
    }

    public resetFilters() {
        this._searchStore.dispatch(new search.ResetFilterOption());
        this.navigate();
        this.closeFiltersAndNavigateMobile();
    }

    public initFilters() {
        this.showFilters = true;
    }

    private containsFilterParameters(params: any): boolean {
        return Boolean(params && params['filter1']);
    }

    public onFilterClearEvent() {
        this.navigate();
    }

    public getPageText(): string {
        let categoryName = (this.fourthLvlRoot && this.fourthLvlRoot.name) ? this.fourthLvlRoot.name : this.rootParentNode.name;
        return this.pageText.replace('CATEGORY', categoryName);
    }

    public navigareToSelectedFilterView() {
        let hidenElementHight = this.filtersEl ? this.filtersEl.nativeElement.offsetHeight : 0;
        let topOfElement = this.selectedFilterView.nativeElement.offsetTop - hidenElementHight - headerHeight;
        setTimeout(() => {
            window.scroll({ top: topOfElement, behavior: "smooth" });
        }, 500)
    }

    public closeFiltersAndNavigateMobile() {
        this.mobileFiltersShown = false;
        if (this.IsMobile()) {
            this.navigareToSelectedFilterView();
        }
    }

    public isShowMoreDisplayed(): Observable<boolean> {
        return this.totalCount$.pipe(map(total => {
            let isLast = Math.ceil(total / this.searchParameters.count) == this.currentPage;
            return Boolean((this.searchParameters.from + this.searchParameters.count) < total && !isLast)
        }));
    }

    public loadMoreProducts(): void {
        this.scrollAllowed = false; //block next scroll to search results
        this._searchStore.dispatch(new search.LoadMoreProducts());
        this.currentPage++;
    }

    public containsSubcategories(): boolean {
        return Boolean(this.rootParentNode &&
            this.rootParentNode.children &&
            this.rootParentNode.children.length);
    }

    public toggleSubcategories(): void {
        this.subcategoriesIsShown = !this.subcategoriesIsShown;
    }

    public getRouteForSubcategory(node: Node): string[] {
        return this._routingParamsService.getRouteForSubcategory(node, this.currentRouteParams);
    }


    public getQueryParameters(): Object {
        return this.queryParameters["queryParams"];
    }

    public getQueryParametersWithoutPage(): Object {
        const params = { ...this.queryParameters["queryParams"] };
        delete params["page"];
        return params;
    }

    public setCatalogType(type: CatalogType): void {
        this._searchStore.dispatch(new search.SetFormFactor(type));
        this.navigate()
    }

    public typeSwitchShown(): boolean {
        return (this.rootParentNode &&
            this.rootParentNode.deepLevel != 0 &&
            !this.isOnThirdLevelOfCatalog() &&
            !this.isSecondWithoutFourth()
        );
    }

    public changeShowText(): void {
        this.showBottomText = !this.showBottomText;
    }

    public hideOrShowText(): string {
        if (this.showBottomText) {
            return 'block-show';
        } else {
            return 'block-hide';
        }
    }

    public isSelectedCarAndMark() {
        let filters = this.selectedFilters;
        return filters && filters["SuitableVehicles_Mark"]?.selectedOptions?.length && filters["SuitableVehicles_Serie"]?.selectedOptions?.length;
    }
}
