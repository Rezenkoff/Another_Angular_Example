import { Component } from '@angular/core';
import { NewsService } from "../../services/news.service";
import { NavigationService } from "../../services/navigation.service";
import { LanguageService } from "../../services/language.service";
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { News } from "../../models/news.model";
import { BaseLoader } from '../../shared/abstraction/loaderbase.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

const pageIndex: number = 1;
const pageSize: number = 4;
const onlyActive: boolean = true;

@Component({
    selector: 'news',
    templateUrl: './__mobile__/news.component.html',
    styleUrls: ['./__mobile__/styles/news.component__.scss']
})

export class NewsComponent extends BaseLoader {

    public news: News = new News();
    public latestNews: Array<News> = new Array<News>();
    public latestNewsLoaded: boolean = false;
    public newsId: number;
    public saveHtml: SafeHtml;
    public languageId: number = 2;
    public languageId$: BehaviorSubject<number> = new BehaviorSubject<number>(this.languageId);

    constructor(
        private _newsService: NewsService,
        private _navigationService: NavigationService,
        private route: ActivatedRoute,
        private _router: Router,
        private _sanitizer: DomSanitizer,
        private _languageService: LanguageService,
    ) {
        super();
        this._router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.initialize();
            }
        });
        this._languageService.getLanguageChangeEmitter()
            .subscribe(() =>
                this.initialize()
        );
    }
    
    initialize(): void {
        this.StartSpinning();
        this.languageId = this.getLanguageId();
        this.languageId$.next(this.languageId);
        let params = this.route.snapshot.params;
        this.newsId = params['id'];
        this._newsService
            .getNewsById(this.newsId).pipe(
                finalize(() => this.EndSpinning()))
            .subscribe((response:any )=> {
                this.news = response.data;
                this.EndSpinning();
                this.saveHtml = this._sanitizer.bypassSecurityTrustHtml(this.languageId === 2 ? this.news.content : this.news.ukrContent);
            });
        let languageId = this.getLanguageId();
        this._newsService.getNews(pageIndex, pageSize, languageId, onlyActive)
            .subscribe(response => {
                this.latestNewsLoaded = true;
            });
    }

    private openNews(news: News): void {
        this._navigationService.NavigateToNewsDetails(news);
    }

    private getLanguageId(): number {
        let result = 2;
        if (this._languageService) {
            result = this._languageService.getSelectedLanguage().id;
        }
        return result;
    }

    public getPreviewPictureUrl(url: string): string {
        let imageName = url.split('/').pop();
        let imagePreviewName = "Preview_" + imageName;
        let imagePreviewUrl = url.replace(imageName, imagePreviewName);
        return imagePreviewUrl;
    };
}