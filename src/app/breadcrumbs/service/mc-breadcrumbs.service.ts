import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { IBreadcrumb, wrapIntoObservable } from '../mc-breadcrumbs.shared';
import { McBreadcrumbsResolver } from './mc-breadcrumbs.resolver';
import { filter, first, concat, map, distinctUntilKeyChanged } from 'rxjs/operators';
import { McBreadCrumbsFilteredService } from './mc-breadcrumbs-filtered.service';
import { FilterTypesEnum } from '../../filters/models/filter-types.enum';
import { ProductInfoStorageService } from '../../services/product-info-storage.service';
import { McBreadcrumbsParamsModel } from '../models/mc-breadcrumbs-params.model';
import { McBreadcrumbsType } from '../models/mc-breadcrumbs-type.enum';

@Injectable()
export class McBreadcrumbsService {

    private _breadcrumbs = new BehaviorSubject<IBreadcrumb[]>([]);
    private _defaultResolver = new McBreadcrumbsResolver();
    private _queryParams: Object = null;

    constructor(
        private _router: Router,
        private _injector: Injector,
        private _mcBreadCrumbsFilteredService: McBreadCrumbsFilteredService,
        private _productInfoStorageService: ProductInfoStorageService,
    ) {
        this._router.events
            .pipe(filter((x) => x instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {

                const currentRoot = _router.routerState.snapshot.root;

                let breadcrumbsParams = this.getParamsForCustomBreadCrumbs(_router.routerState.snapshot);

                const lastCrumbEnabled: boolean = this.isLastCrumbEnabled(_router.routerState.snapshot);

                if (breadcrumbsParams.isCustomBreadCrumbs) {

                    this._mcBreadCrumbsFilteredService.getBreadCrumbsForFilteredCatalog(breadcrumbsParams).subscribe(crumbs => {

                            const breadcrumbs: IBreadcrumb[] = (lastCrumbEnabled) ? [...crumbs, { path: '', text: '' }] : crumbs;
                            this._breadcrumbs.next(breadcrumbs);
                        });
                }
                else {
                    this._resolveCrumbs(currentRoot).subscribe(crumbs => {

                        const breadcrumbs: IBreadcrumb[] = (lastCrumbEnabled) ? [...crumbs, { path: '', text: '' }] : crumbs;
                        this._breadcrumbs.next(breadcrumbs);
                    });
                }
            });
        this._productInfoStorageService.getProductInfo().pipe(distinctUntilKeyChanged('id')).subscribe(() => {

            const currentRoot = _router.routerState.snapshot.root;
            this._resolveCrumbs(currentRoot).subscribe(crumbs => {
                this._breadcrumbs.next(crumbs);
            });
        });
    }

    get crumbs$(): Observable<IBreadcrumb[]> {
        return this._breadcrumbs;
    }

    private _resolveCrumbs(route: ActivatedRouteSnapshot)
        : Observable<IBreadcrumb[]> {

        let crumbs$: Observable<IBreadcrumb[]>;

        const data = route.routeConfig &&
            route.routeConfig.data;

        if (data && data.breadcrumbs) {

            let resolver: McBreadcrumbsResolver;

            if (data.breadcrumbs.prototype instanceof McBreadcrumbsResolver) {
                resolver = this._injector.get(data.breadcrumbs);
            } 
            else {
                resolver = this._defaultResolver;
            }

            const result = resolver.resolve(route, this._router.routerState.snapshot);
            crumbs$ = wrapIntoObservable<IBreadcrumb[]>(result).pipe(first());

        } 
        else {
            crumbs$ = of([]);
        }

        if (route.firstChild) {

            crumbs$ = crumbs$.pipe(concat(this._resolveCrumbs(route.firstChild)),
                map(crumbs => {

                    const catalogType = route.queryParams["formFactor"];

                    if (catalogType) {
                        this._queryParams = { formFactor: catalogType };
                    } 
                    else {
                        this._queryParams = null;
                    }

                    return crumbs;
                }));
        }

        return crumbs$;
    }

    public getQueryParamsForBreadcrumb(): Object {

        return this._queryParams;
    }

    private getParamsForCustomBreadCrumbs(routeStateSnapshot: RouterStateSnapshot): McBreadcrumbsParamsModel {

        let pageName = this.getMainPageName(routeStateSnapshot.url);
        let result = new McBreadcrumbsParamsModel(true);

        if (pageName === 'category') {

            result.filter1 = this.findParametersInRoute('filter1', routeStateSnapshot.root);
            result.filter2 = this.findParametersInRoute('filter2', routeStateSnapshot.root);
            result.urlEnding = this.findParametersInRoute('urlEnding', routeStateSnapshot.root);

            if (!result.filter1 || !this.isCarMarkFilter(result.filter1)) {
                return new McBreadcrumbsParamsModel(false);
            }

            if (result.filter2 && !this.isCarSerieFilter(result.filter2)) {
                result.filter2 = null;
            }

            result.breadCrumbsType = McBreadcrumbsType.Category;
            return result;
        }
        else if (pageName === 'cars-catalog') {

            result.filter1 = this.findParametersInRoute('carMark', routeStateSnapshot.root);
            result.filter2 = this.findParametersInRoute('carSerie', routeStateSnapshot.root);

            if (!result.filter1 || !this.isCarMarkFilter(result.filter1)) {

                return new McBreadcrumbsParamsModel(false);
            }
            if (result.filter2 && !this.isCarSerieFilter(result.filter2)) {

                result.filter2 = null;
            }

            result.breadCrumbsType = McBreadcrumbsType.CarsCatalog;
            return result;
        }
        else if (pageName === 'brands-catalog') {

            result.filter1 = this.findParametersInRoute('brand', routeStateSnapshot.root);

            if (!result.filter1) {

                return new McBreadcrumbsParamsModel(false);
            }

            result.breadCrumbsType = McBreadcrumbsType.BrandsCatalog;
            return result;
        }
        else {

            return new McBreadcrumbsParamsModel(false);
        }
    }

    private getMainPageName(url: string) {

        let fragmentedUrl = url.split('/');

        for (var i = 0; i < fragmentedUrl.length; i++) {

            if (fragmentedUrl[i].length > 0) {

                return fragmentedUrl[i]
            }
        }

        return null;
    }

    private findParametersInRoute(paramName: string, route: ActivatedRouteSnapshot) {
        if (route) {

            let value = route.paramMap.get(paramName);
            return value ? value : this.findParametersInRoute(paramName, route.firstChild);
        }

        return null;
    }

    private isCarMarkFilter(filter: string): boolean {

        return filter.endsWith("--" + FilterTypesEnum.SuitableVehicles_Mark);
    }

    private isCarSerieFilter(filter: string): boolean {
        
        return filter.endsWith("--" + FilterTypesEnum.SuitableVehicles_Serie);
    }

    private isLastCrumbEnabled(snapshot: RouterStateSnapshot): boolean {

        const pageName = this.getMainPageName(snapshot.url);

        if (pageName != 'category') {
            return false;
        }

        const queryParams = snapshot.root.queryParams;

        if (queryParams['page']) {
            return true;
        }

        return this.paramsContainsBrandFilter(snapshot);
    }

    private paramsContainsBrandFilter(snapshot: RouterStateSnapshot): boolean {

        const filterParam: string = this.findParametersInRoute('filter1', snapshot.root);

        if (!filterParam) {

            return false;
        }

        const startIdx = filterParam.indexOf("--") + 2;
        const filterTypeId = filterParam.substring(startIdx, filterParam.length);

        const filterType: number = Number(filterTypeId);

        if (isNaN(filterType)) {

            return false;
        }

        if (FilterTypesEnum.Uncategorized_Manufacturer <= filterType && filterType < FilterTypesEnum.SuitableVehicles_Mark) {
            
            return true;
        }

        return false;
    }
}
