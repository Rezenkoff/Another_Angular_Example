import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { SearchParameters } from '../../search/models/search-parameters.model';
import { Product } from '../../models/product.model';

@Component({
    selector: 'search-analogs',
    templateUrl: './__mobile__/search-analogs.component.html',
    styleUrls: ['./__mobile__/styles/search-analogs.component__.scss']
})

export class SearchAnalogsComponent implements OnInit {
    public subscription: Subscription;
    public isAnalogsComponent: boolean = true;
    public product$: Observable<Product>;
    public totalCount$: Observable<number>;
    public options;
    public currentPage: number = 1;
    public searchParameters: SearchParameters;
    public isList: boolean = false;

    constructor(
        @Inject(APP_CONSTANTS) private _appconstants: IAppConstants,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,        
    ) {
        this.options = this._appconstants.SEARCH.SORT_OPTIONS;
    }

    public ngOnInit() {
        this.searchParameters = new SearchParameters();
        this.subscription = this._activatedRoute.params.subscribe(params => {            
            this.currentPage = Number(params["page"]) || 1;
        });
    }

    public setProduct(product: Observable<Product>): void {
        this.product$ = product;
        product.subscribe(p => {            
            this.searchParameters.searchPhrase = p.id.toString();
        });
    }

    public setTotalCount(total: Observable<number>): void {
        this.totalCount$ = total;
    }

    public setListClass(isListClass: boolean) {
        this.isList = isListClass;
    }

    setPageSize(size: number) {
        if (!size) {
            return;
        }
        this.searchParameters.count = size;

        let parameters = this.getSearchParameters();
        this._router.navigate(['analogs', this.searchParameters.searchPhrase, parameters]);
    }

    public pageChanged(page: any) {
        if (!page.currentPage) {
            return;
        }
        this.searchParameters.from = page.currentPage;

        let parameters = this.getSearchParameters();
        this._router.navigate(['analogs', this.searchParameters.searchPhrase, parameters]);
    }

    public getSearchParameters(): Object {
        let parameters: Object = {};
        parameters['page'] = this.searchParameters.from || 1;
        if (this.searchParameters.count !== 20) {
            parameters['pageSize'] = this.searchParameters.count;
        }
        //'category' parameter can be added here
        //parameters['category'] = 'products';
        return parameters;
    }

    //Not implemented
    setIsRest(event: any) {

    }

    setFormFactor(event: any) {

    }

    search(event: any) {

    }

    setSortByDisplayDescr(event: any) {

    }
}