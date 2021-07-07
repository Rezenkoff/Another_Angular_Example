﻿import { Component, OnInit } from '@angular/core';
import { NewsService } from "../../services/news.service";
import { NavigationService } from "../../services/navigation.service";
import { LanguageService } from "../../services/language.service";
import { News } from "../../models/news.model";
import { BaseLoader } from '../../shared/abstraction/loaderbase.component';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'all-news',
    templateUrl: './__mobile__/all-news.component.html',
    styleUrls: ['./__mobile__/styles/all-news.component__.scss']
})
     
export class AllNewsComponent extends BaseLoader implements OnInit {

    constructor(
        private _newsService: NewsService,
        private router: Router,
        private _navigationService: NavigationService,
        private _languageService: LanguageService
    ) {
        super();
    }

    public newsList: News[] = [];
    public pageSize: number = 10;
    public totalItems: number = 0;
    private currentPage: number = 1;
    private languageId: number = 2;
    private onlyActive: boolean = true;
    public languageId$: BehaviorSubject<number> = new BehaviorSubject<number>(this.languageId);

    ngOnInit() {
        this.getNewsList();
        this._languageService.languageChange
            .subscribe((item) => {
                this.languageId$.next(item.id);
            });
    }

    private getNewsList(): void {
        this.StartSpinning();
        this.setLanguageId();
        this._newsService
            .getNews(this.currentPage, this.pageSize, this.languageId, this.onlyActive).pipe(finalize(() => { this.EndSpinning(); }))
            .subscribe((response:any) => {
                this.newsList = response.data;
                this.totalItems = response.total;
                this.EndSpinning();
            });
    }

    private pageChanged(event: any): void {
        this.currentPage = event.currentPage;
        this.getNewsList();
    }

    private openNewsDetails(news: News): void {
        this._navigationService.NavigateToNewsDetails(news);
    }

    private setLanguageId() {
        let language = this._languageService.getSelectedLanguage();
        if (language && language.id) {
            this.languageId = language.id;
            this.languageId$.next(language.id);
        }
    }

    public getPreviewPictureUrl(url: string): string {
        let imageName = url.split('/').pop();
        let imagePreviewName = "Preview_" + imageName;
        let imagePreviewUrl = url.replace(imageName, imagePreviewName);
        return imagePreviewUrl;
    };
}