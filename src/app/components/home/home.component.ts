import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from "@angular/core";
import { News } from "../../models/news.model";
import { NewsService } from "../../services/news.service";
import { NavigationService } from "../../services/navigation.service";
import { LanguageService } from "../../services/language.service";
import { finalize, takeUntil } from 'rxjs/operators';
import { CatalogService } from '../../services/catalog-model.service';
import { Node } from '../../catalog/models/node.model';
import { ServerParamsTransfer } from '../../server-params-transfer.service';
import { BannersService } from '../../services/banners.sevice';
import { Subject, BehaviorSubject } from "rxjs";
import { BannerAndCategory } from "../../models/banner/BannerAndCategory";
import { CarouselConfig } from "ngx-bootstrap/carousel";
import { CatalogType } from "../../catalog/models/catalog-type.enum";

const pageIndex: number = 1;
const pageSize: number = 4;
const onlyActive: boolean = true;

const countBlock: number = 4;
const parentBanner: number = 0;

@Component({
    selector: '',
    templateUrl: './__mobile__/home.component.html',
    providers: [
        { provide: CarouselConfig, useValue: { interval: 0, noPause: true, showIndicators: true } }
    ]
})

export class HomeComponent implements OnInit, OnDestroy
{
    nodes: Node[] = [];
    public lastNews: News = new News();
    public latestNewsLoaded: boolean = false;
    public collapsed: boolean = true;
    public readonly onlyTires: number = 49;
    public columnCatgory: Array<number> = Array(countBlock).fill(0).map((x, i) => i);
    public destroy$: Subject<boolean> = new Subject<boolean>();
    public banners: Array<BannerAndCategory> = [];
    private languageId: number = 2;
    public newsList: News[] = [];
    public totalItems: number = 0;
    public showMainText: Boolean = false;
    public languageId$: BehaviorSubject<number> = new BehaviorSubject<number>(this._languageService.getSelectedLanguage().id);
    public showNews: boolean = false;
    public showPopular: boolean = false;
    public showBottomText: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _serverParamsService: ServerParamsTransfer,
        private _catalogService: CatalogService,
        private _newsService: NewsService,
        private _navigationService: NavigationService,
        private _languageService: LanguageService,
        private _bannersService: BannersService,
    ) {
    }

    subscription: any;
    ngOnInit() {
        this.getNews();
        this.setLanguageId();
        this.getBanners();
        this._languageService.languageChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(item => {
                this.getBanners();
                this.languageId$.next(item.id);
            });
        this._catalogService.InitCatalogModelForType(CatalogType.Full)
            .pipe(takeUntil(this.destroy$))
            .subscribe(nodes => {
                this._catalogService.CatalogTreeModel = nodes;
                if (nodes && nodes.length > 0) {
                    this.nodes = nodes[0].children;
                }
            });
       
    }

    public openNewsDetails(news: News): void {
        this._navigationService.NavigateToNewsDetails(news);
    }

    getLastNews(newsList: News[]) {
        this.lastNews = newsList[0];
        return newsList;
    }

    getNews() {
        this.latestNewsLoaded = false;
        this.setLanguageId();
        this._newsService
            .getNews(pageIndex, pageSize, this.languageId, onlyActive).pipe(finalize(() => { this.latestNewsLoaded = true; }))
            .subscribe((response:any) => {
                this.newsList = this.getLastNews(response.data);
                this.totalItems = response.total;
            });
    }

    showMore(): void {
        this.collapsed = false;
    }

    hideMore(): void {
        this.collapsed = true;
    }

    public IsMobile() {
        return this._serverParamsService.serverParams.isMobileDevice;
    }

    private setLanguageId() {
        let language = this._languageService.getSelectedLanguage();
        if (language && language.id) {
            this.languageId = language.id;
        }
    }

    private getBanners() {
        this._bannersService.GetBannersWithCategory()
            .pipe(takeUntil(this.destroy$))
            .subscribe((banners: Array<BannerAndCategory>) => {              
                this.banners = banners;
            });
    }

    public swapTires(banners: Array<BannerAndCategory>): Array<BannerAndCategory> {
        if (banners.length == 0) {
            return;
        }

        let index = banners.findIndex(obj => obj.svgImage == "tires-catalog");
        if (index) {
            banners[index].id = 0;
        }

        this.banners = banners.sort(function (a, b) { return a.id - b.id });

        return banners;
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    public isNewsView(isFirst: boolean) {
        return this.IsMobile() ? true : !isFirst;
    }

    public CategoryOfBanner(bannerId: number) {
        return this.banners.filter(category => category.parentId == bannerId);;
    }

    public validSubBlock(blockIndex: number, categoryIndex: number) {
        let step: number = 3;
        let startLimitElement: number = step * blockIndex;
        let endLimitElement: number = startLimitElement + step;

        return startLimitElement < categoryIndex && categoryIndex <= endLimitElement;
    }

    public getPreviewPictureUrl(url: string): string {
        if (!url) {
            return 'https://cdn.autodoc.ua/images/no_image.png';
        }

        let imageName = url.split('/').pop();
        let imagePreviewName = "Preview_" + imageName;
        let imagePreviewUrl = url.replace(imageName, imagePreviewName);
        return imagePreviewUrl;
    };

    public changeShowText(): void {
        this.showBottomText = !this.showBottomText;
    }

    public hideOrShowText(): string {
        if (this.showBottomText) {
            return 'block-show';
        } else {
            return 'block-hide';
        }
    }
}
