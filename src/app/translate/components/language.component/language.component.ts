import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '../../translations';
import { APP_CONSTANTS, IAppConstants } from '../../../config/app-constants';
import { Language } from '../../../models/language.model';
import { LanguageService } from '../../../services/language.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'autodoc-language',
    templateUrl: './__mobile__/language.component.html'
})

export class LangComponent implements OnInit {
    public supportedLanguages: Language[] = new Array<Language>();
    public currentLanguageValue: Language;
    public currentLanguage: string;
    public isShowDropdown: boolean = false;

    @ViewChild('lang')
    public langRef: ElementRef;
    
    constructor(
        @Inject(APP_CONSTANTS) private constants: IAppConstants,
        private _translate: TranslateService,
        private _languageService: LanguageService) {
        
    }

    ngOnInit() {
        this._languageService.getLanguages().subscribe((data :any) => {
            this.supportedLanguages = data.data as Language[];
            let lngName = this.getSelectedLanguage();
            this.selectLang(lngName);
        });
    }

    public getDisplay(): string {
        return this.isShowDropdown ? this.constants.STYLING.DISPLAY_BLOCK : this.constants.STYLING.DISPLAY_NONE;
    }

    public toggleLanguageDropdown(): void {
        this.isShowDropdown = !this.isShowDropdown;
    }

    public displayIcon(name: string): string {
        if (name) {
            let lng = this.getLanguageByName(name);
            return environment.languageIconPath + lng.icon;
        }
    }

    public isCurrentLang(name: string): boolean {
        return name === this._translate.currentLang;
    }

    public selectLang(name: string): void {
        let lng = this.getLanguageByName(name);
        this._translate.use(lng.name);
        this.currentLanguage = lng.name;
        this.currentLanguageValue = lng;
        this.isShowDropdown = false;
        this._languageService.setSelectedLanguage(lng);


    }

    private getLanguageByName(name: string): Language {
        return this.supportedLanguages.find(lng => lng.name == name);
    }

    private getSelectedLanguage(): string {
        let lng = this._languageService.getSelectedLanguage();
        return lng ? lng.name : environment.defaultLanguage;
    }
}
