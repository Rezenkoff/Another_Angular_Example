import { Component } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { SearchParameters } from '../../search/models/search-parameters.model';
import { FiltersService } from '../../filters/services/filters.service';
import { StrKeyValueModel } from '../../models/key-value-str.model';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'wheels-tab',
    templateUrl: './__mobile__/wheels-tab.component.html',
    styleUrls: ['./__mobile__/styles/wheels-tab.component__.scss']
})

export class WheelsTabComponent {
    private filterType: Array<string> = ['WheelDisc_Color', 'WheelDisc_Width', 'WheelDisc_Diameter', 'WheelDisc_PCD', 'WheelDisc_ET', 'WheelDisc_DIA'];
    public searchParameters: SearchParameters = new SearchParameters();
    public colorSettings$: Observable<Array<StrKeyValueModel>>;
    public diameterSettings$: Observable<Array<StrKeyValueModel>>;
    public widthSettings$: Observable<Array<StrKeyValueModel>>;
    public PCDSettings$: Observable<Array<StrKeyValueModel>>;
    public ETSettings$: Observable<Array<StrKeyValueModel>>;
    public DIASettings$: Observable<Array<StrKeyValueModel>>;
    public showDropDownItem: Array<boolean> = [false, false, false, false, false, false,]
    public filterColor: string = '';
    public filterDiameter: string = '';
    public filterWidth: string = '';
    public filterPCD: string = '';
    public filterET: string = '';
    public filterDIA: string = '';
    public url: string = '/category/diski-id50-3';
    public discParam: DiscParam = new DiscParam();
    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private _filterService: FiltersService
    ) {
    }

    ngOnInit() {
        this.searchParameters.categoryUrl = '"diski-id50-3"';
        this.searchParameters.formFactor = 2;
        this.searchParameters.selectedCategory = 'wheelDisc';
        this.searchParameters.sortOrder = 1;
        this.searchParameters.artId = 0;
        this.searchParameters.count = 20;

        let  params = {
            "filterType": 'WheelDisc_Width',
            "jsonGetParams": JSON.stringify(this.searchParameters)
       };

        this._filterService.getAllFilter(params).pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.colorSettings$ = of(data.filter(x => x.groupKey == 42)[0].values);
            this.widthSettings$ = of(data.filter(x => x.groupKey == 37)[0].values);
            this.diameterSettings$ = of(data.filter(x => x.groupKey == 38)[0].values);
            this.PCDSettings$ = of(data.filter(x => x.groupKey == 39)[0].values);
            this.ETSettings$ = of(data.filter(x => x.groupKey == 40)[0].values);
            this.DIASettings$ = of(data.filter(x => x.groupKey == 41)[0].values);
        });; 
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public getColorList(colorList: StrKeyValueModel[]): StrKeyValueModel[] {
        if (this.filterColor != '' && colorList) {
            return colorList.filter(param => param.value.toLowerCase().includes(this.filterColor.toLowerCase()));
        }

        return colorList;
    }

    public getWidthList(widthList: StrKeyValueModel[]): StrKeyValueModel[] {
        if (this.filterWidth != '' && widthList) {
            return widthList.filter(param => param.value.includes(this.filterWidth));
        }

        return widthList;
    }

    public getDiameterList(diameterList: StrKeyValueModel[]): StrKeyValueModel[] {
        if (this.filterDiameter != '' && diameterList) {
            return diameterList.filter(param => param.value.includes(this.filterDiameter));
        }

        return diameterList;
    }

    public getPCDList(pcdList: StrKeyValueModel[]): StrKeyValueModel[] {
        if (this.filterPCD != '' && pcdList) {
            return pcdList.filter(param => param.value.includes(this.filterPCD));
        }

        return pcdList;
    }

    public getETList(etList: StrKeyValueModel[]): StrKeyValueModel[] {
        if (this.filterET != '' && etList) {
            return etList.filter(param => param.value.includes(this.filterET));
        }

        return etList;
    }

    public getDIAList(diaList: StrKeyValueModel[]): StrKeyValueModel[] {
        if (this.filterDIA != '' && diaList) {
            return diaList.filter(param => param.value.includes(this.filterDIA));
        }

        return diaList;
    }

    public selectColor(colorKey: string, colorValue: string) {
        this.showDropDownItem[0] = false;
        this.filterColor = colorValue;
        this.discParam.WheelDisc_Color = colorKey;
    }
    public selectWidth(widthKey: string, widthValue: string) {
        this.showDropDownItem[1] = false;
        this.filterWidth = widthValue;
        this.discParam.WheelDisc_Width = widthKey;
    }
    public selectDiameter(diameterKey: string, diameterValue: string) {
        this.showDropDownItem[2] = false;
        this.filterDiameter = diameterValue;
        this.discParam.WheelDisc_Diameter = diameterKey;
    }
   
    public selectPCD(pcdKey: string, pcdValue: string) {
        this.showDropDownItem[3] = false;
        this.filterPCD = pcdValue;
        this.discParam.WheelDisc_PCD = pcdKey;
    }
    public selectET(etKey: string, etValue: string) {
        this.showDropDownItem[4] = false;
        this.filterET = etValue;
        this.discParam.WheelDisc_ET = etKey;
    }
    public selectDIA(diaKey: string, diaValue: string) {
        this.showDropDownItem[5] = false;
        this.filterDIA = diaValue;
        this.discParam.WheelDisc_DIA = diaKey;
    }

    public toggleDropdownItem(position: number) {
        this.showDropDownItem.forEach((item, index) => {
            if (index == position) {
                this.showDropDownItem[index] = !item;
            } else {
                this.showDropDownItem[index] = false;
            }
        });
    }

    public getQueryParams(): Object {
        return this.discParam as Object;
    }
}

class DiscParam {
    public WheelDisc_Color: string;
    public WheelDisc_Width: string;
    public WheelDisc_Diameter: string;
    public WheelDisc_PCD: string;
    public WheelDisc_ET: string;
    public WheelDisc_DIA: string;
}
