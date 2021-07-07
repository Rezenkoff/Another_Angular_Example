import { Component, Input, OnChanges, Inject, Output, EventEmitter } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { StrKeyValueModel } from '../../models/key-value-str.model';

@Component({
    selector: 'filter-dropdown',
    templateUrl: './__mobile__/filter-dropdown.component.html',
    styleUrls: ['./__mobile__/styles/filter-dropdown.component__.scss']
})

export class FilterDropdownComponent implements OnChanges {   
    @Input() filterSearchString?: string = "";   
    @Input() filterDataList?: StrKeyValueModel[] = [];
    @Input() itemsListLoad?: boolean = false;
    @Input() placeholder?: string = "Поиск...";
    @Input() isActive?: boolean = true;
    @Input() showDropDown?: boolean = false;

    @Output() onChageFilter?: EventEmitter<StrKeyValueModel> = new EventEmitter<StrKeyValueModel>();
    @Output() onClickEvent?: EventEmitter<void> = new EventEmitter<void>();   
    @Output() onFilterClearEvent?: EventEmitter<StrKeyValueModel> = new EventEmitter<StrKeyValueModel>();
    @Output() onInputChangeEvent?: EventEmitter<boolean> = new EventEmitter<boolean>(); 
    @Output() onOptionsRequest?: EventEmitter<string> = new EventEmitter<string>();

    public filterSelected: StrKeyValueModel = new StrKeyValueModel("", "");    
    public tmpfilterDataList: StrKeyValueModel[] = [];

    constructor(@Inject(APP_CONSTANTS) private _constants: IAppConstants) {
    }

    ngOnChanges(changes): void {
        if (changes['filterDataList'] && changes['filterDataList'].currentValue) {
            this.tmpfilterDataList = [...changes['filterDataList'].currentValue];
        }
    }

    public selectedFilter(item: StrKeyValueModel): void {
        //this.filterSearchString = item.value;
        this.showDropDown = false;
        this.onChageFilter.emit(item);
    }

    public onClick() {
        this.showDropDown = true;
        this.onClickEvent.emit();
    }

    public getDisplay(): string {
        return this.showDropDown ? this._constants.STYLING.DISPLAY_BLOCK : this._constants.STYLING.DISPLAY_NONE;
    }

    public hideDropdown(): void {
        this.showDropDown = false;
        this.itemsListLoad = false;
    }

    public findElemFilter(text: string): void {
        this.showDropDown = true;
        this.onOptionsRequest.emit(text);

        if (text) {
            this.onInputChangeEvent.emit(true);
        }
    };

    public onFilterClear(item: StrKeyValueModel) {
        this.filterSearchString = "";
        this.tmpfilterDataList = this.filterDataList;
        this.onFilterClearEvent.emit(item);
    }

    public isDropdownShown(): boolean {
        return Boolean(this.filterDataList && this.filterDataList.length > 0 && this.showDropDown);
    }

    public isCloseIconShown(): boolean {
        return Boolean(!this.itemsListLoad && this.filterSearchString);
    }

    public isDisabled(): boolean {
        return !this.isActive;
    }
}
