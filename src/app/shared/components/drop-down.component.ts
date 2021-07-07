import { Component, OnInit, OnDestroy, Input, OnChanges, Inject, Output, EventEmitter } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { StrKeyValueModel } from '../../models/key-value-str.model';

@Component({
    selector: 'drop-down',
    templateUrl: './__mobile__/drop-down.component.html'
})

export class DropDownComponent implements OnDestroy, OnInit, OnChanges {
    @Input() filterSelectedKey: string;
    @Input()  filterSelected: StrKeyValueModel = new StrKeyValueModel("", "");
    @Input() filterDataList: StrKeyValueModel[];
    @Output() onChageFilter: EventEmitter<StrKeyValueModel> = new EventEmitter<StrKeyValueModel>();
    @Output() onClickEvent: EventEmitter<void> = new EventEmitter<void>();
    @Input() itemsListLoad: boolean = false;
    @Output() onFilterClearEvent: EventEmitter<StrKeyValueModel> = new EventEmitter<StrKeyValueModel>();

    private emptyStr: string = '';
    public showDropDown: boolean = false;
    public tmpfilterDataList: StrKeyValueModel[] = new Array<StrKeyValueModel>();

    constructor(@Inject(APP_CONSTANTS) private _constants: IAppConstants) {
    }

    public selectedFilter(item: StrKeyValueModel): void {
        this.showDropDown = false;
        this.onChageFilter.emit(item);
    }

    public onClick() {
        this.showDropDown = true;
        this.filterDataList = new Array<StrKeyValueModel>();
        this.onClickEvent.emit();
    }

    ngOnInit(): void {
        this.filterSelectedKey = (this.filterSelected && this.filterSelected.value) ?
            this.filterSelected.value :
            "";
    }

    ngOnChanges(): void {
        if (this.filterDataList) {
            this.findElemFilter(this.emptyStr);
        }
        this.setSelectedValue();
    }

    ngOnDestroy(): void {

    }

    public getDisplay(): string {
        return this.showDropDown ? this._constants.STYLING.DISPLAY_BLOCK : this._constants.STYLING.DISPLAY_NONE;
    }

    public hideDropdown(): void {
        this.showDropDown = false;
        this.itemsListLoad = false;
    }

    public findElemFilter(text: string): void {
        if (!text) {
            this.setSelectedValue();
        }
        this.tmpfilterDataList = new Array<StrKeyValueModel>();

        this.filterDataList.map(
            (elem) => {
                if (text.length == 0)
                    this.tmpfilterDataList.push(elem);
                else if (elem.value.toLowerCase().indexOf(text.toLowerCase()) >= 0)
                    this.tmpfilterDataList.push(elem);
            });
    };

    public onFilterClear(item: StrKeyValueModel) {
        this.onFilterClearEvent.emit(item);
    }

    public setSelectedValue() {
        this.filterSelected = new StrKeyValueModel("", "");

        if (this.filterSelectedKey) {
            if (this.filterDataList && this.filterDataList.length > 0) {
                this.filterSelected = this.filterDataList.find(item => item.key === this.filterSelectedKey);
            } 
            //this.filterSelected = new StrKeyValueModel(this.filterSelectedKey, this.filterSelectedKey);
        }        
    }
}
