import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { ProductDetail, ResourceInfo } from '../models/index';
import { SpriteSpinService } from '../../services/spritespin.service';
import { ScriptService } from '../../lazyloading/script.service';
import { CarouselImage } from '../models/carouselImage.model';
import { CdnImageHelper } from '../../app-root/cdn-image-path';
import { McBreadcrumbsService } from '../../breadcrumbs/service/mc-breadcrumbs.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MainUrlParser } from '../../app-root/main-url.parser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'product-image',
    templateUrl: './__mobile__/product-image.component.html',    
    styleUrls: ['./__mobile__/styles/product-image.component__.scss']
})
export class ProductImageComponent implements OnInit {
    
    galleryImages: CarouselImage[];
    enabled3d: boolean = false;
    @Input() product: ProductDetail;
    @Input() categoryName: string;
    @Input() brand: string;
    @Input() lookupNumber: string;
    @Input() is3D: any;
    @Input() stock: boolean;
    img3dUrl: string;
    private arrDescr: Array<string>;
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        private _imagePathResolver: CdnImageHelper,
        @Inject(PLATFORM_ID) private platformId: number,
        private _spriteSpin: SpriteSpinService,
        private _scripts: ScriptService,
        @Inject(MainUrlParser) private urlParser: MainUrlParser,
        private _activatedRoute: ActivatedRoute,
        private _breadcrumbsService: McBreadcrumbsService
    ) { }

    public ngOnInit(): void {            

        this.galleryImages = [];

        if (!this.product.resourceList)
            this.product.resourceList = [];

		this.product.resourceList = this.product.resourceList.sort((a,b) =>  (a.number > b.number) ? 1 : -1)

        if (this.categoryName == '' || this.categoryName == undefined || this.categoryName == null) {
            this.GetCategoryNameForGoogleBot();
        }
        
        this.product.resourceList.forEach((item, index) => {
            if (item.docType.toUpperCase() == 'JPG') {
                let src = this.getImageUrl(item);
                let descr: string = '';
                if (index == 0) {
                    descr = `Фото ${this.categoryName} ${this.lookupNumber} ${this.brand}. Изображение товара ${this.product.productDisplayDescription}`;
                }
                
                let image = {
                    small: src,
                    medium: src,
                    big: src,
                    description: descr,
                    alt:'',
                    title:''
                };
                this.galleryImages.push(image);
            }
            else if (item.docType.toUpperCase() == 'I3D') {
                this.img3dUrl = this.getImageUrl(item);
            }
          
        });

        this.getAltAtribut();

        if (this.galleryImages.length == 0)
            this.galleryImages.push({ small: this._constants.IMAGES.NO_IMAGE_URL, medium: this._constants.IMAGES.NO_IMAGE_URL, big: this._constants.IMAGES.NO_IMAGE_URL, description:'', alt:'',title:'' });
    }

    private GetCategoryNameForGoogleBot(): void {     
        let urlEnding: string;
        this._activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe(
            params => {
                urlEnding = params['urlEnding'];
            });

        let categoryId = this.urlParser.parseUrlForCategoryId(urlEnding);
        this._breadcrumbsService.crumbs$.pipe(takeUntil(this.destroy$)).subscribe(crumbs => {
            let crumb = crumbs.find(x => x.path.includes("id" + categoryId.toString()));
            this.categoryName = (crumb) ? crumb.text : "";
        })
    }

    public getAltAtribut(): void {
        if (this.galleryImages.length < 2) {
            return;
        }

        let indexGalery = 1;
        let indexWrite = 0;
        let indexRemainder = 0;
        this.arrDescr = new Array<string>(this.product.resourceList.filter(i => i.docType != 'I3D').length - 1);

        if (this.arrDescr) {
            this.arrDescr.fill(`${this.categoryName} `);
        }
       
        if (this.product.oeCodeList) {
            this.product.oeCodeList.forEach((item, index) => {
                if (this.galleryImages[indexGalery]) {
                    this.arrDescr[indexWrite] += item.code + ", ";
                    indexGalery++;
                    indexWrite++;
                }
                else {
                    indexGalery = 1;
                    indexWrite = 0;
                    if (indexRemainder < this.arrDescr.length) {
                        this.arrDescr[indexRemainder] += item.code + ", ";
                        indexRemainder++;
                    }
                    else {
                        indexRemainder = 0;
                        this.arrDescr[indexRemainder] += item.code + ", ";
                    }
                }
            });
        }
     
        if (this.arrDescr.length) {
            this.arrDescr.forEach((item, index) => {
                let start = item.trim();
                start = start.charAt(start.length - 1) === ',' ? start.slice(0, -1) : start;
                this.galleryImages[index + 1].description = `${start} - аналог для ${this.lookupNumber} ${this.brand}`;
            });
        }   
    }

    getImageUrl(image: ResourceInfo): any {
        if (image.name)
            return environment.carouselImages + `${image.name}`;
        else
            return environment.apiUrl + `product/image?productId=${image.productId}&number=${image.number}`;
    }

    enable3D() {
        this._scripts.load('spritespin').then(data => { 
            this.enabled3d = true;
            this._spriteSpin.animate(this.img3dUrl);
        }).catch(error => console.log(error));
        
    }

    close() {
        this.enabled3d = false;
    }

    public is3DEnabled(): void {
        if (this.enabled3d) {
            return this._constants.STYLING.DISPLAY_BLOCK;
        }
        return this._constants.STYLING.DISPLAY_NONE;
    }
}