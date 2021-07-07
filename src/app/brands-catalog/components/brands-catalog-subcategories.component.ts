import { Component, OnInit, OnDestroy } from '@angular/core';
import { SeoTagsService } from '../../services/tags.service';
import { BaseLoader } from '../../shared/abstraction/loaderbase.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { BrandsCatalogService } from '../service/brands-catalog.service';
import { takeUntil } from 'rxjs/operators';
import { BrandNode } from '../models/brand-node.model';
import { LinkService } from '../../services/link.service';
import { Brand } from '../models/brand.model';
import { BrandTopProductModel } from '../models/brand-top-product.model';
import { CdnImageHelper } from 'src/app/app-root/cdn-image-path';

@Component({
    selector: 'brands-catalog-subcategories',
    templateUrl: './__mobile__/brands-catalog-subcategories.component.html',
    styleUrls: ['./__mobile__/styles/brands-catalog-subcategories.component__.scss']
})

export class BrandsCatalogSubcategoriesComponent extends BaseLoader implements OnInit, OnDestroy {

    public catalogNodes: BrandNode[] = [];
    public brand: Brand = new Brand();
    public pageText: string = '';
    public routeArray: string[] = [];
    public isCollapsedDescription: boolean = true;
    public topProducts: BrandTopProductModel[];
    
    private _destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private _brandsCatalogService: BrandsCatalogService,
        private _tagsService: SeoTagsService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _linkService: LinkService,
        private _imagePathResolver: CdnImageHelper,
    ) {
        super();
    }

    ngOnInit() {
        this._router.events.pipe(takeUntil(this._destroy$)).subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.init();
            }
        });
        this.init();
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
        this._linkService.clearSEOlinks();
    }

    private init() {
        let params = this._activatedRoute.snapshot.params;
        let brandUrl = params['brand'] || '';
        this.routeArray = [brandUrl];

        this.setCatalogNodesAndTitle(brandUrl);
        this.getPageText();

        const ignoredTags = ['next', 'prev'];
        this._linkService.buildSEOlinks(1, '', ignoredTags);

        this._brandsCatalogService.getTopProducts(brandUrl).subscribe(result => this.topProducts = result);
    }

    private setCatalogNodesAndTitle(brandUrl: string): void {
        if(!brandUrl) {
            return;
        }
        this.StartSpinning()
        this._brandsCatalogService.getBrandByUrl(brandUrl).subscribe(result => {
            this.EndSpinning();
            if (result) {
                this.brand = result;
            }
        });
        this._brandsCatalogService.getBrandsCatalog(brandUrl).subscribe(nodes => {
            this.catalogNodes = (nodes[0].children as BrandNode[]);
        });
    }

    public getPageText() {
        this._tagsService.GetSeoTextByUrl('', this.routeArray).subscribe(text => {
            this.pageText = text.replace('CATEGORY', 'Каталог для');
        });
    }

    public toggleDescriptionCollapse() {
        this.isCollapsedDescription = !this.isCollapsedDescription;
    }

    public getImageUrl(id: number): string {
        return this._imagePathResolver.getImage(id);
    }
}