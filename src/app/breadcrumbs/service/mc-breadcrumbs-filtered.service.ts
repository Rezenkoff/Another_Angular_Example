import { Injectable, Inject } from "@angular/core";
import { CarCatalogService } from "../../cars-catalog/services/car-catalog.service"; 
import { IBreadcrumb } from "../mc-breadcrumbs.shared";
import { CarMark } from "../../cars-catalog/models/car-mark.model";
import { Observable } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { CatalogService } from "../../services/catalog-model.service";
import { CatalogType } from "../../catalog/models/catalog-type.enum";
import { IUrlParser, MainUrlParser } from "../../app-root/main-url.parser";
import { McBreadcrumbsParamsModel } from "../models/mc-breadcrumbs-params.model";
import { McBreadcrumbsType } from "../models/mc-breadcrumbs-type.enum";
import { BrandsCatalogService } from "../../brands-catalog/service/brands-catalog.service";

@Injectable()
export class McBreadCrumbsFilteredService {

    private carMarksList: CarMark[] = [];

    constructor(private _carCatalogService: CarCatalogService, private _catalogService: CatalogService,
        @Inject(MainUrlParser) private urlParser: IUrlParser,
        private _brandsCatalogService: BrandsCatalogService, ) { }

    public getBreadCrumbsForFilteredCatalog(breadcrumbsParam: McBreadcrumbsParamsModel): Observable<IBreadcrumb[]> {

        let breadCrumbs: IBreadcrumb[] = [];

        let homeBreadCrumb = {
            path: "",
            text: "Интернет-магазин запчастей Autodoc",
        };

        breadCrumbs.push(homeBreadCrumb);

        if (!breadcrumbsParam.filter1) {

            return new Observable(x => x.next(breadCrumbs));
        }

        if (breadcrumbsParam.breadCrumbsType !== McBreadcrumbsType.BrandsCatalog) {

            if (this.carMarksList.length > 0) {

                return this.fillBreadCrumbsForCar(breadcrumbsParam).pipe(map((breadCrumbsForCar: IBreadcrumb[]) => {

                    for (let i = 0; i < breadCrumbsForCar.length; i++) {

                        breadCrumbs.push(breadCrumbsForCar[i]);
                    }

                    return breadCrumbs;
                }));
            }
            else {
                return this._carCatalogService.getAllSeries().pipe(mergeMap(carMarkList => {

                    this.carMarksList = carMarkList;

                    return this.fillBreadCrumbsForCar(breadcrumbsParam).pipe(map((breadCrumbsForCar: any) => {

                        return [...breadCrumbs, ...breadCrumbsForCar];
                    }));
                }));
            }
        }
        if (breadcrumbsParam.breadCrumbsType === McBreadcrumbsType.BrandsCatalog) {

            return this.fillBreadcrumbsForBrands(breadcrumbsParam).pipe(map((breadCrumbsForCar: any) => {
                
                return [...breadCrumbs, ...breadCrumbsForCar];
            }));
        }
    }

    private fillBreadCrumbsForCar(breadcrumbsParam: McBreadcrumbsParamsModel): Observable<IBreadcrumb[]> {

        let breadCrumbs: IBreadcrumb[] = [];

        let markKey = this._carCatalogService.getKeyStringFromUrl(breadcrumbsParam.filter1);
        let selectedMark = this.carMarksList.filter(x => x.markKey == markKey);
        let path = this._carCatalogService.getRouteForMark(selectedMark[0]);

        let markBreadCrump = {
            text: selectedMark[0].markName,
            path: path.join('/'),
        } as IBreadcrumb;

        breadCrumbs.push(markBreadCrump);

        let serieBreadCrumb;

        if (breadcrumbsParam.filter2) {

            serieBreadCrumb = this.getBreadCrumbForSerie(breadcrumbsParam.filter2, selectedMark[0]);
            breadCrumbs.push(serieBreadCrumb);
        }

        let nodeId = this.urlParser.parseUrlForID(breadcrumbsParam.urlEnding).id;

        if (nodeId) {

            return this._catalogService.getNodeByIdForGoogleBot(nodeId, CatalogType.Full).pipe(map((result) => {

                if (result) {

                    let catalogbreadCrump = result.breadcrumbs[result.breadcrumbs.length - 1];
                    let serieBreadCrumbName = serieBreadCrumb ? serieBreadCrumb.text : '';

                    let customCatalogBreadCrump = {
                        text: `${catalogbreadCrump.text} ${markBreadCrump.text} ${serieBreadCrumbName}`,
                        path: catalogbreadCrump.path
                    } as IBreadcrumb;

                    breadCrumbs.push(customCatalogBreadCrump);
                    return breadCrumbs;
                }
            }));
        }
        else {
            return new Observable(x => x.next(breadCrumbs));
        }
    }

    private getBreadCrumbForSerie(serie: string, selectedMark: CarMark): IBreadcrumb {

        let serieKey = this._carCatalogService.getKeyStringFromUrl(serie);
        let selectedSerie = selectedMark.seriesList.filter(x => x.serieKey == serieKey);
        let path = this._carCatalogService.getRouteForCarSerie(selectedMark, selectedSerie[0]);

        let serieBreadCrump = {
            text: selectedSerie[0].serieName,
            path: path.join('/'),
        } as IBreadcrumb;

        return serieBreadCrump;
    }

    private fillBreadcrumbsForBrands(breadcrumbsParam: McBreadcrumbsParamsModel): Observable<IBreadcrumb[]> {

        let breadCrumbs: IBreadcrumb[] = [];

        if (breadcrumbsParam.filter1) {

            return this._brandsCatalogService.getBrandByUrl(breadcrumbsParam.filter1).pipe(map((brand) => {

                let brandBreadcrumb = {
                    text: brand.name,
                    path: brand.url
                } as IBreadcrumb;
                
                breadCrumbs.push(brandBreadcrumb);
                return breadCrumbs;
            }));
        }
        else {
            return new Observable(x => x.next(breadCrumbs));
        }
    }
}