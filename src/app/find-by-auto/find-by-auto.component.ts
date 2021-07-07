import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { APP_CONSTANTS, IAppConstants } from '../config';
import { LanguageService } from '../services/language.service';
import { AuthHttpService } from '../auth/auth-http.service';
import { BaseLoader } from '../shared/abstraction/loaderbase.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'find-by-auto',
    templateUrl: './__mobile__/find-by-auto.component.html'
})

export class FindByAutoComponent extends BaseLoader implements OnInit {

    public vinSearchString: string = '';   
    public vinModel: string;
    private ssd: string;    
    public vinSearchCar: boolean = false;
    public currentLanguage: string;
    public isAuthorized: boolean = false;

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,
        @Inject(PLATFORM_ID) private platformId: Object,
        private _languageService: LanguageService,
        private _authHttpService: AuthHttpService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        super();
        _router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {   
                this.vinSearchString = this._route.snapshot.paramMap.get('vinCode');
                this.vinSearch();
            }
        });
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.getCurrentLanguage();
            this._languageService.languageChange.subscribe(() => this.getCurrentLanguage());
            this.isAuthorized = this._authHttpService.isAuthenticated();
        }
    }
    
    vinSearch() {
        let vin = this.vinSearchString;        

        if (this.isValidVin()) {
            this.vinModel = vin;
            this.vinSearchCar = true;
        }     
    }

    searchButtonDisplayed(): boolean {
        return (this.ssd) ? true : false;
    }

    getCurrentLanguage() {
        let lang = this._languageService.getSelectedLanguage();
        if (lang && lang.name) {
            this.currentLanguage = lang.name;
            return;
        }
        this.currentLanguage = "RUS"
    }

    isValidVin(): boolean {
        if (this.vinSearchString && this._constants.PATTERNS['VIN_REGEX']) {
            let regExp = new RegExp(this._constants.PATTERNS['VIN_REGEX']);
            let str = this.vinSearchString.trim().toUpperCase();
            return regExp.test(str);
        }
    }

    clearSearchResults() {
        this.vinSearchCar = false;
    }

    private onCarSelected(vin: string) {
        if (!vin) {
            return;
        }
        this.vinSearchString = vin;
        this.vinSearch();
    }
}