import { Component } from "@angular/core";
import { CatalogService } from "../../services/catalog-model.service";
import { RoutingParametersService } from "../../services/routing-parameters.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Node } from '../../catalog/models';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: '',
    templateUrl: './__mobile__/catalog-banner-category.component.html'
})
export class CatalogBannerCategory {
    private destroy$: Subject<Boolean> = new Subject<Boolean>();
    private bannerId: number;
    public nodeList: Node[] = [];
    private currentRouteParams: any = null;

    constructor(private catalogService: CatalogService,
        private _activatedRoute: ActivatedRoute,
        private _routingParamsService: RoutingParametersService) { }

    ngOnInit() {
        let queryParams = this._activatedRoute.snapshot.queryParams;
        this.bannerId = queryParams["id"];
        let params = this._activatedRoute.snapshot.params;
        this.currentRouteParams = params;

        this.catalogService.getBannerCatalog(this.bannerId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((list: Node[]) => {
                this.nodeList = list;
            });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private getSubcategoryRouteLink(node: Node): string[] {
        return this._routingParamsService.getRouteForSubcategory(node, this.currentRouteParams);
    }
}