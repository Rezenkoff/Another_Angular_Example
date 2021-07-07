import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromSearch from '../search/reducers';
import { SearchParameters } from '../search/models';
import { RoutingParametersModel } from '../models/routing-parameters.model';
import { Node } from '../catalog/models';
import { MainUrlParser } from '../app-root/main-url.parser';
import { GenericFilterModel, FilterTypesEnum, SeoRoute, PriorityUrlPair } from '../filters/models';
export const currentFilterNameKey: string = 'currentFilterValue';
const filterUrlSplitter: string = '--';

@Injectable()
export class RoutingParametersService {

    private searchParameters: SearchParameters = new SearchParameters();
    private catalogNodeName: string = "";

    constructor(
        @Inject(MainUrlParser) private urlParser: MainUrlParser,
        private searchStore: Store<fromSearch.State>        
    ) { }

    public getRoutingParameters(routeParams: Object): Observable<RoutingParametersModel> {
        this.catalogNodeName = routeParams['urlEnding'] || '';

        return this.searchStore.select(fromSearch.getSearchParameters).pipe(map(searchParams => {
            let queryParameters = this.getQueryParameters(searchParams, routeParams);
            let route = this.getRouteSectionsArray(searchParams, routeParams);
            let routingParamsModel = new RoutingParametersModel(route, queryParameters);
            routingParamsModel = this.clearRedundantInfoFromParams(routingParamsModel);
            return routingParamsModel;
        }));
    }

    private getQueryParameters(searchParams: SearchParameters, urlParams: Object): Object {
        let parameters = { queryParams: null };
        parameters.queryParams = this.prepareQueryParamsObject(searchParams);
        return parameters;
    }

    private getRouteSectionsArray(searchParameters: SearchParameters, urlParams: Object): string[] {
        if (!this.catalogNodeName) {
            return [];
        }
        let urlsArray = ["category"];
        for (let url in urlParams) {
            urlsArray.push(urlParams[url]);
        }
        urlsArray = this.actualizeRouteParams(searchParameters, urlsArray);
        return urlsArray;
    }

    private prepareQueryParamsObject(source: SearchParameters): Object {
        const nameof = <T>(name: keyof T) => name;
        const treePartPropName: string = nameof<SearchParameters>("treeParts");
        const pageNumPropName: string = 'page';
        const fromPropName: string = nameof<SearchParameters>("from");

        let queryParams = new Object();
        let default_params: SearchParameters = new SearchParameters();
        let isDefault: boolean = true;

        for (let prop in source) {
            if (source[prop] == null || source[prop] == default_params[prop]) {
                continue; //ignore default values
            } else if (source[prop] && source[prop] != default_params[prop]) {
                isDefault = false;
            }

            if (Array.isArray(source[prop]) && source[prop].length === 0) {
                continue; //ignore empty arrays
            } 

            if (prop == treePartPropName && source[prop].length === 1) {
                continue; //ignore 'treePart' with 1 value in array;
            }

            if (prop == fromPropName) {
                continue; //ignore 'from' value
            }

            //if (prop == pageNumPropName) {
            //    continue; //ignore 'page' value
            //}

            queryParams[prop] = this.cloneProperty(source[prop]);
        }

        let page: number = this.getPageNumber(source);
        if (page > 1) {
            queryParams[pageNumPropName] = page;
        }
        return queryParams;
    }

    private getPageNumber(parameters: SearchParameters): number {
        return (Number(parameters.from) / Number(parameters.count)) + 1;
    }

    private clearRedundantInfoFromParams(routingParameters: RoutingParametersModel): RoutingParametersModel {

        let updatedParams = new RoutingParametersModel([...routingParameters.route], { ...routingParameters.queryParameters });
        let removeFromUrlParamsList = [];
        let queryParams = updatedParams.queryParameters['queryParams'];

        delete (queryParams['categoryUrl']);
        delete (queryParams['selectedCategory']);

        for (let p in queryParams) {
            if (Array.isArray(queryParams[p]) && queryParams[p].length > 1) {
                removeFromUrlParamsList.push(p);
            }
        }

        for (let p of updatedParams.route) {
            let filter = this.urlParser.parseUrlForFilterParameters(p);
            if (!filter) {
                continue;
            }
            if (filter && removeFromUrlParamsList.includes(FilterTypesEnum[filter.type])) {
                let idx = updatedParams.route.indexOf(p);
                if (idx > -1) {
                    updatedParams.route.splice(idx, 1);
                    continue;
                }
            }
            delete (queryParams[FilterTypesEnum[filter.type]]);
            continue;
        }

        return updatedParams;
    }

    private cloneProperty(property: any): any {
        if (Array.isArray(property)) {
            return [...property];
        }

        if (property !== null && typeof property === 'object') {
            return { ...property };
        }

        return property;
    }

    public actualizeRouteParams(searchParams: SearchParameters, routeParams: string[]): string[] {        
        if (!searchParams || !routeParams) {
            return null;
        }
        let actualParams: string[] = [];

        routeParams.forEach(p => {
            let filter = this.urlParser.parseUrlForFilterParameters(p);            
            if (!filter) {
                actualParams.push(p);
                return;
            }
            if (filter && searchParams[FilterTypesEnum[filter.type]]) {
                let currentSearchParamsKey = searchParams[FilterTypesEnum[filter.type]][0];
                if (filter.key == currentSearchParamsKey) {
                    actualParams.push(p);
                    return;
                }
                if (filter.key != currentSearchParamsKey) {                    
                    actualParams.push(this.convertFilterToUrlParam(currentSearchParamsKey, filter.type));
                    return;
                }
            }
        })

        return actualParams;
    }

    public convertFilterToUrlParam(key: string, type: number): string {
        return `${key}${filterUrlSplitter}${type}`;        
    }

    public getRoutingParametersFromState(filterReferencesDict: Object, categoryUrl: string): RoutingParametersModel {
        let routeParams: RoutingParametersModel = {
            route: (categoryUrl) ? ["category", categoryUrl] : ["search-result"],
            queryParameters: {
                queryParams: {}
            }
        };

        let promotedFilters: GenericFilterModel[] = [];
        let otherFilters: GenericFilterModel[] = [];

        for (let prop in filterReferencesDict) {
            let filter = filterReferencesDict[prop] as GenericFilterModel;
            if (!filter.selectedOptions || !filter.selectedOptions.length) {
                continue;
            }
            if (filter.isPromoted && filter.selectedOptions.length == 1) {
                promotedFilters.push(filter);
                continue;
            }
            otherFilters.push(filter);
        }

        let sortedPromotedFilters = promotedFilters.sort((a, b) => { return a.positionPriority - b.positionPriority });
        //promoted
        sortedPromotedFilters.forEach(filter => {
            let key = filter.selectedOptions[0].key;
            routeParams.route.push(this.convertFilterToUrlParam(key, FilterTypesEnum[filter.filterType]));
        })
        //not promoted
        otherFilters.forEach(filter => {
            routeParams.queryParameters["queryParams"][filter.filterType] = filter.selectedOptions.map(o => o.key);                     
        })
        
        return routeParams;
    }

    public getRoute(seoRoute: SeoRoute): RoutingParametersModel {
        let routeParams: RoutingParametersModel = {
            route: seoRoute.routeSectionsArray.map(x => x.url),
            queryParameters: seoRoute.queryParameters
        };
        return routeParams;
    }

    public getRoutesDictForFilter(currentFilter: GenericFilterModel, seoRoute: SeoRoute): Object {
        if (currentFilter.isPromoted) {
            return this.getRoutesDictForPromoted(currentFilter, seoRoute);
        }
        return this.getRoutesDictForNonPromoted(currentFilter, seoRoute);
    }

    private getRoutesDictForPromoted(currentFilter: GenericFilterModel, seoRoute: SeoRoute): Object {
        let current: PriorityUrlPair = { priority: currentFilter.positionPriority, url: currentFilterNameKey };

        let seoRouteCopy: SeoRoute = {
            routeSectionsArray: [...seoRoute.routeSectionsArray],
            queryParameters: { ...seoRoute.queryParameters }
        }

        let currentFilterIdx = seoRouteCopy.routeSectionsArray.findIndex(x => x.priority == currentFilter.positionPriority);
        if (currentFilterIdx >= 0) {
            seoRouteCopy.routeSectionsArray[currentFilterIdx] = current;
        } else {
            seoRouteCopy.routeSectionsArray.push(current);
            seoRouteCopy.routeSectionsArray = seoRouteCopy.routeSectionsArray.sort((a, b) => { return a.priority - b.priority });
        }
        let routeParamsTemplate = this.getRoute(seoRouteCopy);

        let routesDict = new Object();
        currentFilter.options.forEach(option => {
            let routeParams = { ...routeParamsTemplate, route: [...routeParamsTemplate.route] };
            let idx = routeParams.route.indexOf(currentFilterNameKey);
            if (idx >= 0) {
                routeParams.route[idx] = this.convertFilterToUrlParam(option.key, FilterTypesEnum[currentFilter.filterType]);
            }
            routesDict[option.key] = routeParams;
        })

        return routesDict;
    }

    private getRoutesDictForNonPromoted(currentFilter: GenericFilterModel, seoRoute: SeoRoute): Object {
        let seoRouteCopy: SeoRoute = {
            routeSectionsArray: [...seoRoute.routeSectionsArray],
            queryParameters: { ...seoRoute.queryParameters }
        }
        
        let routesDict = new Object();
        let routeParamsTemplate = this.getRoute(seoRouteCopy);
        let key: string = currentFilter.filterType;

        currentFilter.options.forEach(option => {
            let queryParams = {};
            if (routeParamsTemplate.queryParameters && routeParamsTemplate.queryParameters["queryParams"]) {
                queryParams = {
                    ...routeParamsTemplate.queryParameters["queryParams"]
                };
            } 
            queryParams[key] = option.key;

            let routeParams: RoutingParametersModel = {
                route: routeParamsTemplate.route,
                queryParameters: {
                    queryParams: queryParams
                }
            }
            routesDict[option.key] = routeParams;
        })

        return routesDict;        
    }

    public getRouteForSubcategory(node: Node, routeParams: Object): string[] {
        let result: string[] = ['/category'];
        let params = { ...routeParams };
        params['urlEnding'] = node.pageURL;
        for (let prop in params) {
            result.push(params[prop]);
        }        
        return result;
    }

    public getQueryParamsForSubcategory(queryParameters: Object): Object {
        return (queryParameters && queryParameters['queryParams'] && queryParameters['queryParams']['formFactor'] !== undefined) ?
            { formFactor: queryParameters['queryParams']['formFactor'] } : null;
    }
}