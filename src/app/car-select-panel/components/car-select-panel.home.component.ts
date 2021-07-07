import { Component, OnInit, OnDestroy } from '@angular/core';
import { CarSelectPanelService } from '../services/car-select-panel.service';
import { Store } from '@ngrx/store';
import * as fromCarSelectPanel from '../reducers';
import { CarSelectPanelCommonComponent } from './car-select-panel.component';
import { LanguageService } from '../../services/language.service';
import * as fromFilters from '../../filters/reducers';

@Component({
    selector: 'car-select-panel-home',
    templateUrl: './__mobile__/car-select-panel.home.component.html'
})
export class CarSelectPanelHomeComponent extends CarSelectPanelCommonComponent implements OnInit, OnDestroy {

    constructor(_carSelectPanelService: CarSelectPanelService,
        _carSelectPanelStore: Store<fromCarSelectPanel.State>,
        _languageService: LanguageService,
        _filterStore: Store<fromFilters.State>,) {
        super(_carSelectPanelService, _carSelectPanelStore, _languageService, _filterStore);
    }
}