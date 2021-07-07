import { LanguageService } from '../services/language.service';
import { SeoTagsService } from '../services/tags.service';
import { Injectable, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { MainUrlParser } from './main-url.parser';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SearchParameters } from '../search/models';
import { GtagCommonEventsHandlerService } from '../seo/services/gtag-common-events-handler.service';
import { environment } from '../../environments/environment';


export interface ISeoEventHandler {
    changeTitleOnNavigation(router: Router): void;
    getTitle(): string;
}

@Injectable()
export class MainSeoEventHandler implements ISeoEventHandler, OnDestroy {
    private routerSub$: Subscription;
    private routerSubParams$: Subscription;
    private endPageTitle: string = 'autodoc.ua';
    private defaultPageTitle: string = 'autodoc';
    private tags = ['keywords', 'description', 'subject', 'language', 'robots', 'revised', 'abstract', 'topic', 'summary', 'Classification', 'author', 'designer', 'copyright', 'reply-to', 'owner', 'url', 'identifier-URL', 'directory', 'category', 'coverage', 'distribution', 'rating', 'revisit-after'];
    private defaultImgUrl: string = 'https://cdn.autodoc.ua/images/header/logo.png';
    private productTypeId: number = 0;

    constructor(
        @Inject(MainUrlParser)
        private urlParser: MainUrlParser,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private meta: Meta,
        private tagsService: SeoTagsService,
        private title: Title,
        private _languageService: LanguageService,
        private _gtagSender: GtagCommonEventsHandlerService,
    ) { }

    public getTitle(): string {
        return this.title.getTitle();
    }

    public changeTitleOnNavigation(router: Router): void {

        this.routerSub$ = router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => this.activatedRoute),
            map(route => {
                while (route.firstChild)
                    route = route.firstChild;

                return route;
            }),
            filter(route => route.outlet === 'primary')).subscribe((event) => {
                let identificator: any = { id: 0, type: 0, category: -1 };

                this.routerSubParams$ = event.data.subscribe(data => {
                    identificator = { id: data['identificator'], type: data['type'], category: -1 };
                });

                let rawUrlId = (event.params['value'].urlEnding) ? event.params['value'].urlEnding : '';
                let pageNumber = this.activatedRoute.snapshot.queryParams['page'] || 1;

                let idType = identificator.type ? identificator : this.urlParser.parseUrlForID(rawUrlId) || { id: 0, type: 0 };
                let lngId = this._languageService.getSelectedLanguage().id;

                let filterKeys = this.getFilterKeys(event);

                this._removeOpenGraphTags();
                this.updateFacebookMeta(idType?.id === 499100000);

                this.tagsService.GetPageTagsAndTitle(idType, lngId, filterKeys)
                    .subscribe(
                        tags => {
                            this._setMetaAndLinks(tags || {}, pageNumber, idType.type);
                        },
                        error => { } //supress error
                    );

                //remove all tags if page does not have last
                if (!idType)
                    this._removeTags();
            });
    }

    private _setMetaAndLinks(pageData: any, pageNumber: number, typeId: number) {

        let tags = pageData.metatags ? JSON.parse(pageData.metatags) : {};
        let pageInfo: string = (pageNumber > 1) ? " – страница " + pageNumber : "";
        const title = tags.title ? `${tags.title}${pageInfo} | ${this.endPageTitle}` : `${this.defaultPageTitle} | ${this.endPageTitle}`;

        this.title.setTitle(title);

        const metaData = tags.metatags || [];

        for (let i = 0; i < metaData.length; i++) {
            let selector = `name='${metaData[i].name}'`;

            this.meta.removeTag(selector);
            this.meta.updateTag(metaData[i]);
        }

        if (pageNumber != 1) {
            this.meta.removeTag("name='description'");
            this.meta.removeTag("name='keywords'");
        }

        if (!this.IsDefaultParams() || !environment.production) {
            this.meta.updateTag({ name: "robots", content: "noindex, nofollow" });
        }

        this._setOpenGraphTags(title, typeId, pageData.imageUrl);
    }

    private _removeTags() {
        this.tags.forEach(t => {
            this.meta.removeTag(`name='${t}'`);
        });
    }

    private _removeOpenGraphTags() {
        this.meta.removeTag(`property="og:title"`);
        this.meta.removeTag(`property="og:type"`);
        this.meta.removeTag(`property="og:url"`);
        this.meta.removeTag(`property="og:image"`);
    }

    private IsDefaultParams(): boolean {
        let isDefault: boolean = true;
        let source = this.activatedRoute.snapshot.queryParams;
        let url = this.router.url;

        if (!source) {
            return isDefault;
        }

        if (url.includes('?') && !(url.includes('?page='))) {
            return false;
        }

        let default_params: SearchParameters = new SearchParameters();

        for (let prop in source) {
            if (source[prop] && prop != "page" && source[prop] != default_params[prop]) {
                isDefault = false;
                return isDefault;
            }
        }

        return isDefault;
    }

    ngOnDestroy() {
        if (this.routerSub$) {
            this.routerSub$.unsubscribe();
        }
        if (this.routerSubParams$) {
            this.routerSubParams$.unsubscribe();
        }
    }

    getFilterKeys(route: ActivatedRoute): string[] {
        let parameters = route.snapshot.params;
        let filterKeys = [];

        for (let param in parameters) {
            if (param == "carMark" || param == "carSerie" || param == "brand") {
                filterKeys.push(parameters[param]);
            }

            if (param.startsWith("filter")) {
                filterKeys.push(parameters[param]);
            }
        }
        return filterKeys;
    }

    DefaultImgUrl() {
        this.meta.updateTag({ property: 'og:image', content: this.defaultImgUrl });
    }

    private _setOpenGraphTags(title: string, idType: number, imgUrl: string) {
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:type', content: idType == this.productTypeId ? 'product' : 'website' });
        this.meta.updateTag({ property: 'og:url', content: `https://autodoc.ua${this.router.url}` });
        this.meta.updateTag({ property: 'og:image', content: imgUrl });
    }

    private updateFacebookMeta(add: boolean) {
        const fbMetaName = 'facebook-domain-verification';
        if (add) {
            this.meta.addTag({ name: fbMetaName, content: '4i7ga8dlkrfypxq10wkk4mvhufpy0x' });
        }
        else {
            this.meta.removeTag(`name='${fbMetaName}'`);
        }
    }
}