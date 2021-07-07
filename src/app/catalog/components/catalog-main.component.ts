import { Component, Inject, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MainUrlParser } from '../../app-root/main-url.parser';
import { CatalogService } from '../../services/catalog-model.service';
import { SearchParametersService } from '../../services/search-parameters.service';
import { Node } from '../models';
import { Filter, SearchParameters } from '../../search/models';
import * as search from '../../search/actions/search.actions';
import * as fromSearch from '../../search/reducers';
import * as fromFilters from '../../filters/reducers';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { CarFilterKeys } from '../../filters/models/car-filter-keys';
import { ServerParamsTransfer } from '../../server-params-transfer.service';
import { CatalogType } from '../models/catalog-type.enum';

@Component({
    selector: '',
    templateUrl: './__mobile__/catalog-main.component.html',
    styleUrls: ['./__mobile__/styles/catalog-main.component__.scss']
})

export class CatalogMainComponent implements OnInit, OnDestroy, AfterViewInit {

    public CatalogNodeId: number;
    public FourthLevelRoot: Node;
    public RootParentNode: Node;
    public totalCount$: Observable<number>;
    public rtbHouseUrlForCurrentCategory: string = "";

    public seoPageText: string;
    private filters: Filter[] = [];
    private categoryTitle: string = '';
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public catalogType: CatalogType;
    public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public root$: BehaviorSubject<Node> = new BehaviorSubject<Node>(null);
    private _allowFullCatalogFlag: boolean = true;//field needed to avoid infinite loop on non-existing categories

    constructor(
        @Inject(MainUrlParser) private urlParser,
        private _serverParamsService: ServerParamsTransfer,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private catalogService: CatalogService,
        private _searchParamsService: SearchParametersService,
        private searchStore: Store<fromSearch.State>,
        private filterStore: Store<fromFilters.State>
    ) {
        this.totalCount$ = this.searchStore.select(fromSearch.getTotalCount);
    }

    public ngOnInit(): void {
        this._router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
            if (event instanceof NavigationEnd) {                
                this.initialize();
            }
        })

        this.initialize();
   }

    private initialize(): void {
        this._activatedRoute.params.pipe(first()).subscribe(
            params => {
                let queryParams = this._activatedRoute.snapshot.queryParams;
                let catalogNodeName = params['urlEnding'];
                let searchParameters = this._searchParamsService.getSearchParameters(queryParams, catalogNodeName, params);

                this.setCategoryIdFromUrl(params);
                this.setFiltersFromRouteParams(params);

                const newCatalogType = this.getCatalogType(searchParameters);

                if (this.catalogType == newCatalogType) {
                    this.init();
                    return;
                }

                this.loading$.next(true);
                this.catalogType = newCatalogType;

                this.catalogService.setupCatalogByType(this.catalogType, searchParameters, this.CatalogNodeId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(nodes => {
                        this.init();
                });
            });
    }

    private setCategoryIdFromUrl(params: any): void {
        this.CatalogNodeId = this.urlParser.parseUrlForID(params['urlEnding']).id || 0;
    }

    ngAfterViewInit(): void {
    }

    public ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    private init(): void {
        this.searchStore.dispatch(new search.SetCatalogId(this.CatalogNodeId));
        let currentNode = this.getCurrentNode();

        if (!currentNode.nodeId && this._allowFullCatalogFlag) {
            this.catalogType = CatalogType.Full;
            this.catalogService.setupCatalogByType(CatalogType.Full, new SearchParameters(), this.CatalogNodeId)
                .pipe(takeUntil(this.destroy$))
                .subscribe(nodes => {
                    this.init();
                });
            this._allowFullCatalogFlag = false;
            return;
        }
        
        this.FourthLevelRoot = currentNode.getNodeDependsOnLevel();

        this.CatalogNodeId = currentNode.getNodeId(this.FourthLevelRoot);

        this.RootParentNode = this.catalogService.getNodeById(this.CatalogNodeId, this.catalogType);   

        this.loading$.next(false);
        this.setCategoryTitle();
        this.root$.next(this.RootParentNode);
        this._allowFullCatalogFlag = true;
    }

    private getCurrentNode(): Node {
        return new Node(this.catalogService.getNodeById(this.CatalogNodeId, this.catalogType));
    }

    public setCategoryTitle(): void {
        let categoryName = '';
        if (this.FourthLevelRoot && this.FourthLevelRoot.name) {
            categoryName = this.FourthLevelRoot.name;
        } else {
            categoryName = (this.RootParentNode && this.RootParentNode.name) ?
                this.RootParentNode.name :
                categoryName;
        }
        this.filterStore.select(fromFilters.getTextForCategoryTitle).pipe(
            takeUntil(this.destroy$))
            .subscribe(text => {
                this.categoryTitle = `${categoryName} ${text}`;
            })
    }

    private setFiltersFromRouteParams(params: object): void {
        this.filters = [];
        let urlsArray = [];
        for (let url in params) {
            urlsArray.push(params[url]);
        }
        urlsArray.forEach(filterString => {
            let filter = this.urlParser.parseUrlForFilterParameters(filterString);
            if (filter) {
                this.filters.push(filter);
            }
        });
    }

    private getCatalogType(searchParameters: SearchParameters): CatalogType {

        if (searchParameters.formFactor != CatalogType.Full) {
            return searchParameters.formFactor as CatalogType;
        }

        if (searchParameters[CarFilterKeys.markKey]) {
            return CatalogType.Filtered;
        }

        for (let prop in searchParameters) {
            if (prop.endsWith("Manufacturer")) {
                return CatalogType.Filtered;
            }
        }

        if (this._serverParamsService.serverParams.isBotRequest) {
            return CatalogType.Bot;
        }

        return CatalogType.Full;
    }
}
