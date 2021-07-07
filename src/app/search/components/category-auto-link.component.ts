import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { CategoryPlusService } from '../../services/category-plus.service';
import { CategoryAutoModel } from '../models/category-plus.model';
import * as fromSearch from '../../search/reducers';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
    selector: 'category-auto-link',
    templateUrl: './__mobile__/category-auto-link.component.html',
    styleUrls: ['./__mobile__/styles/category-auto-link.component__.scss']
})
export class CategoryAutoLinkComponent {
    public categoryAutoModel: CategoryAutoModel = new CategoryAutoModel();
    public categoryAutoModelList: Array<CategoryAutoModel> = [];
    public categoryUrl: string;
    private destroy$: Subject<boolean> = new Subject<boolean>();
 

    constructor(
        private _categoryPlusService: CategoryPlusService,
        private _searchStore: Store<fromSearch.State>,
    ) { }

    ngOnInit() {
        this._searchStore.select(fromSearch.getSearchParameters).pipe(takeUntil(this.destroy$)).subscribe(sp => {
            for (const key in sp) {
                if (key == "SuitableVehicles_Mark") {
                    this.categoryAutoModel.carMarkId = sp[key][0].split('-id')[1];
                    continue;
                }
                else if (key == "SuitableVehicles_Serie") {
                    this.categoryAutoModel.carSerieId = sp[key][0].split('-id')[1];
                    continue;
                } 
                else if (key == "treeParts") {
                    this.categoryAutoModel.categoryId = sp[key][0].toString();
                    continue;
                } 
            }
            if (this.categoryAutoModel.carMarkId) {
                this._categoryPlusService.getUrlsForAuto(this.categoryAutoModel).pipe(takeUntil(this.destroy$)).subscribe(autoList => {
                    if(typeof(autoList) == "object")
                    {
                        this.categoryAutoModelList = autoList.filter(el => el.carSerieId != this.categoryAutoModel.carSerieId);
                    }
                });
            }  
        });   
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}