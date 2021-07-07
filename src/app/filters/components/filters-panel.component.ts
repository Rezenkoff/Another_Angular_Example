import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BaseLoader } from '../../shared/abstraction/loaderbase.component';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { tap, finalize, first } from 'rxjs/operators';
import * as fromSearch from '../../search/reducers';
import * as fromFilters from '../reducers';
import * as filtersActions from '../actions/filters.actions';

@Component({
    selector: 'filters-panel',
    templateUrl: './__mobile__/filters-panel.component.html'
})

export class FiltersPanelComponent extends BaseLoader implements OnInit, OnDestroy {
    @Input()
    public categoryUrl: string; 
    private navigationSubscription: Subscription;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _searchStore: Store<fromSearch.State>,
        private _filterStore: Store<fromFilters.State>
    ) {
        super();        
    }

    ngOnInit() {         
        this.initialize();
        this.navigationSubscription = this._router.events.subscribe((val) => {            
            if (val instanceof NavigationEnd) {                
                this.initialize();
            }
        });
    }

    ngOnDestroy() {
        this._filterStore.dispatch(new filtersActions.SetCategoryUrlAction(''));
        this.navigationSubscription.unsubscribe();
    }

    private initialize() {
        let params = this._activatedRoute.snapshot.params;
        this.categoryUrl = params['urlEnding'];
        this._filterStore.dispatch(new filtersActions.SetCategoryUrlAction(this.categoryUrl));   

        this._searchStore.select(fromSearch.getSearchParameters).pipe(first()).subscribe(sp => {
            this._filterStore.dispatch(new filtersActions.LoadFilterSettingsAction(sp));
        });
    }
}