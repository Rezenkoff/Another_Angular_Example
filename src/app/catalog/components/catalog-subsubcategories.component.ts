import { RoutingParametersService } from '../../services/routing-parameters.service';
import { Component, Input } from '@angular/core';
import { Node } from '../models';

@Component({
    selector: 'catalog-sub-subs',
    templateUrl: './__mobile__/catalog-subsubcategories.component.html',
    styleUrls: ['./__mobile__/styles/catalog-subsubcategories.component__.scss'],
})
export class CatalogSubSubCategoriesComponent {

    constructor(
        private _routingParamsService: RoutingParametersService
    ) { }

    @Input()
    public children: Node[] = null;

    @Input()
    public parent: Node = null;

    @Input()
    public rootParentNode: Node = null;

    @Input()
    public routeParams: string[] = [];

    @Input()
    public queryParameters: Object = null;

    public isParentOnHighLevel(): boolean {
        return this.parent.deepLevel == 1;
    }

    public isParentOnSecondLevel(): boolean {
        return this.parent.deepLevel == 2;
    }

    public isParentOnThirdLevel(): boolean {
        return this.parent.deepLevel == 3;
    }

    public isRootOnFirstLevelOfCatalog(): boolean {
        return this.rootParentNode && this.rootParentNode.deepLevel == 1;
    }

    public isRootOnSecondLevelOfCatalog(): boolean {
        return this.rootParentNode && this.rootParentNode.deepLevel == 2;
    }

    private getSubcategoryRouteLink(node: Node): string[] {
        return this._routingParamsService.getRouteForSubcategory(node, this.routeParams);
    }
}
