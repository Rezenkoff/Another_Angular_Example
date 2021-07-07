import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MainUrlParser } from '../app-root/main-url.parser';
import { SearchParameters } from '../search/models';
import { FilterTypesEnum } from '../filters/models/filter-types.enum';
import * as search from '../search/actions/search.actions';
import * as fromSearch from '../search/reducers';

@Injectable()
export class SearchParametersService {

    private currentPage: number = 1;
    private searchParameters: SearchParameters = new SearchParameters();
    private catalogNodeName: string = "";    

    constructor(
        @Inject(MainUrlParser) private urlParser: MainUrlParser,
        private searchStore: Store<fromSearch.State>
    ) { }

    public getSearchParameters(params: any, catalogNodeName: string = "", urlParameters?: Object): SearchParameters {
        this.searchParameters = new SearchParameters();
        this.currentPage = Number(params["page"]) || 1;
        this.catalogNodeName = catalogNodeName;

        if (urlParameters) {
            this.setFilters(urlParameters);
        }

        this.searchParameters.searchPhrase = params['searchPhrase'] || "";
        this.searchParameters.carModels = this.getNumberArray(params['carModels']);
        this.searchParameters.carTypes = this.getNumberArray(params['carTypes']);
        this.searchParameters.count = Number(params['count'] || 20);
        this.searchParameters.formFactor = Number(params['formFactor'] || 2);
        this.searchParameters.productLines = params['productLines'] || [];
        this.searchParameters.rest = Number(params['rest'] || 0);
        this.searchParameters.sortField = params['sortField'] || '';
        this.searchParameters.sortOrder = params['sortOrder'] || 1;
        this.searchParameters.from = (this.currentPage - 1) * this.searchParameters.count;
        this.searchParameters.categoryUrl = catalogNodeName;
        this.setGenericFilters(params);
        
        this.setTreeParts(params);        

        return this.searchParameters;
    }

    public pageChanged(page: any) {
        if (!page.currentPage) {
            return;
        }
        let pageSize = this.searchParameters.count;
        this.searchStore.dispatch(new search.SetFromField((page.currentPage - 1) * pageSize))
    }

    private setTreeParts(params: Object): void {
        if (params['treeParts'] && Array.isArray(params['treeParts'])) {
            this.searchParameters.treeParts = params['treeParts'];
        }
        else if (params['treeParts'] && !Array.isArray(params['treeParts'])) {
            this.searchParameters.treeParts = Array.of(params['treeParts'])
        }
        else {
            this.searchParameters.treeParts = Array.of(this.urlParser.parseUrlForID(this.catalogNodeName).id || 0)
        }
    }

    private setGenericFilters(params: Object): void {        
        let genericFiltersParams = this.getGenericParameters(params); 
        for (let param in genericFiltersParams) {
            this.searchParameters[param] = this.getStringArray(params[param])
        }
    }

    public getGenericParameters(params: Object): Object {
        let genericParams = { ...params };
        let defaultParams = { ...new SearchParameters(), v: '', banner: '', page: '' };
        for (let param in defaultParams) {
            delete (genericParams[param]);
        }
        return genericParams;
    }


    private getPageNumber(parameters: SearchParameters): number {
        return (Number(parameters.from) / Number(parameters.count)) + 1;
    }

    private setFilters(urlParameters: Object): void {
        let urlsArray = [];
        for (let url in urlParameters) {
            urlsArray.push(urlParameters[url]);
        }
        urlsArray.forEach(filterString => {
            let filter = this.urlParser.parseUrlForFilterParameters(filterString);            
            if (!filter) {
                return;
            }
            let searchProperty = FilterTypesEnum[filter.type];
            this.searchParameters[searchProperty] = [filter.key];
        });
    }

    private getNumberArray(input: any): Array<number> {
        if (Array.isArray(input)) {
            return input.map(Number);
        } else if (input) {
            return [Number(input)];
        }
        return new Array<number>();
    }

    private getStringArray(input: any): Array<string> {
        if (Array.isArray(input)) {
            return input.map(String);
        } else if (input) {
            return [String(input)];
        }
        return new Array<string>();
    }
}