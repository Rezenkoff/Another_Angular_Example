import { Component, OnInit, OnDestroy, Inject, Output } from '@angular/core';
import { SeoTagsService } from '../../services/tags.service';
import { CarCatalogService } from '../services/car-catalog.service';
import { Node } from '../../catalog/models';
import { CarMark, CarSerie } from '../models';
import { BaseLoader } from '../../shared/abstraction/loaderbase.component';
import { ActivatedRoute, Router, NavigationEnd, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { LinkService } from '../../services/link.service';
import { environment } from "../../../environments/environment";

@Component({
    selector: 'cars-catalog-subcategories',
    templateUrl: './__mobile__/cars-catalog-subcategories.component.html',
    styleUrls: ['./__mobile__/styles/cars-catalog-subcategories.component__.scss']
})

export class CarsCatalogSubcategoriesComponent extends BaseLoader implements OnInit, OnDestroy {

    public catalogNodes: Node[] = [];
    public mainNode: Node;
    private subscriptions: Subscription[] = [];
    @Output() public carInfo: CarMark = null;
    @Output() public carSerie: CarSerie = null;
    private carSerieUrl: string = '';
    private routeArray: string[] = [];
    public pageText: string = '';
    public title: string = '';
    public logoUrl: string = 'https://cdn.autodoc.ua/car-img.svg';
    public queryParams: Params = null;
    @Output() public startImgUrl: string = '';
    @Output() public isOpenNode: boolean = false;

    constructor(       
        private _carCatalogService: CarCatalogService,
        private _tagsService: SeoTagsService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _linkService: LinkService,
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(this._router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.init();
            }
        }));
        this.init();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this._linkService.clearSEOlinks();
    }

    private init() {
        let params = this._activatedRoute.snapshot.params;
        let carMarkUrl = params['carMark'] || '';
        this.carSerieUrl = params['carSerie'] || '';
        this.routeArray.push(this._carCatalogService.getFilterUrlForCarMark(carMarkUrl));
        if (this.carSerieUrl) {
            this.routeArray.push(this._carCatalogService.getFilterUrlForCarSerie(this.carSerieUrl));
        }

        this._carCatalogService.getSeriesForMark(carMarkUrl).subscribe(carInfo => {
            this.carInfo = carInfo;
            this.setTitle(carInfo);
        });

        this.setCatalogNodes(carMarkUrl, this.carSerieUrl);
        this.getPageText();

        this.queryParams = this._activatedRoute.snapshot.queryParams;       

        const ignoredTags = ['next', 'prev'];
        this._linkService.buildSEOlinks(1, '', ignoredTags);
        this.startImgUrl = environment.apiUrl;
    }

    private setCatalogNodes(carMarkUrl: string, carSerieUrl: string): void {
        if (!carMarkUrl) {
            return;
        }
        this.StartSpinning()
        this._carCatalogService.getAutoCatalog(carMarkUrl, carSerieUrl).subscribe(nodes => {
            this.EndSpinning();
            this.mainNode = (nodes[0] as Node);
            this.catalogNodes = (nodes[0].children as Node[]);
        });
    }

    private setTitle(carInfo: CarMark): void {
        let mark = carInfo.markName;
        let modelName = "";
        if (this.carSerieUrl) {
            let serieKey = this.getKeyStringFromUrl(this.carSerieUrl);
            let model = carInfo.seriesList.find(x => x.serieKey == serieKey);
            this.carSerie = (model) ? model : null;
            modelName = (model) ? model.serieName : "";
        }

        this.title = `${mark} ${modelName}`;
    }

    public isModelGroupsDisplayed(): boolean {
        return (this.carInfo && this.carInfo.seriesList && this.carSerieUrl == '');
    }

    public getPageText() {
        this._tagsService.GetSeoTextByUrl('', this.routeArray).subscribe(text => {
            this.pageText = text.replace('CATEGORY', 'Каталог для');
        });
    }

    private getKeyStringFromUrl(url: string): string {
        return this._carCatalogService.getKeyStringFromUrl(url);
    }

    public getRouteForCarSerie(model: CarSerie): string[] {
        return this._carCatalogService.getRouteForCarSerie(this.carInfo, model);
    }

    public onSearchChange(filterString: string) {
        if (!filterString) {
            this.catalogNodes = this.mainNode.children;
            return;
        }

        let filtered = new Array<Node>();
        this.searchTree(this.mainNode, filterString, filtered);
        this.catalogNodes = filtered;
    }

    public searchTree(element: Node, matchingTitle: string, filtered: Node[]) {
        if (element.name.toLowerCase().includes(matchingTitle.toLowerCase())) {
            filtered.push(element);
        }
        if (element.children && element.children.length > 0) {
            element.children.map(item => this.searchTree(item, matchingTitle, filtered));
        }
    }

    private getIdFromKey(modelKey: string) {
        let sections = modelKey.split('--');
        if (sections.length > 0) {
            var keyStr = sections[0];
            var startIdx = keyStr.indexOf('-id') + '-id'.length;
            var length = keyStr.length - startIdx;
            var id = keyStr.substring(startIdx);
            return id;
        }
        else {
            return null;
        }
    }
}