import { Injectable, Inject } from '@angular/core';
import { McBreadcrumbsResolver } from '../breadcrumbs/service/mc-breadcrumbs.resolver';
import { CatalogService } from '../services/catalog-model.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MainUrlParser, IUrlParser } from '../app-root/main-url.parser';
import { ServerParamsTransfer } from '../server-params-transfer.service';

@Injectable()
export class CatalogBreadcrumbsResolver extends McBreadcrumbsResolver {
    
    constructor(
        private serverParamsService: ServerParamsTransfer, 
        @Inject(MainUrlParser) private urlParser: IUrlParser, 
        private _catalogService: CatalogService) { super(); }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
        const rawurl = route.params.urlEnding;
        const nodeId = this.urlParser.parseUrlForID(rawurl).id || 0;      

        return this._catalogService.getBredcrumbsForNode(
            nodeId, this.serverParamsService.serverParams.isBotRequest
            );
    }
}