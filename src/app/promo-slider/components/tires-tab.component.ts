import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SearchParameters } from '../../search/models';
import { FiltersService } from '../../filters/services/filters.service';
import { StrKeyValueModel, GroupModel, StrKeyValueSizeModel } from '../../models/key-value-str.model';
import { takeUntil } from 'rxjs/operators';
import { UserCar } from '../../vehicle/models/user-car.model';
import { TiresParam } from '../../models/tire-params.model';
import { AlertService } from '../../services/alert.service';
import { GenericFilterModel, DropdownFilterModel } from '../../filters/models';

@Component({
    selector: 'tires-tab',
    templateUrl: './__mobile__/tires-tab.component.html',
    styleUrls: ['./__mobile__/styles/tires-tab.component__.scss']
})
export class TiresTabComponent implements OnInit {
    public searchByMarkAuto: boolean = false; 
    public isTruck: boolean = false; 
    public seasonality: Array<string>; 
    public seasonalityState: Number = 2;
    public showDropDown1: boolean = false;
    public showDropDown2: boolean = false;
    public showDropDown3: boolean = false;

    public widthList: Array<string> = [];
    public widthListForNotTrack: Array<string> = [];
    public widthListForTrack: Array<string> = [];

    public diameterList: Array<string> = [];
    public diameterListForNotTruck: Array<string> = [];
    public diameterListForTruck: Array<string> = [];

    public diameterList$: Observable<Array<any>>;
    public sizeDiameter: string = '';
    public sizeProf: string = '';
    public sizeWidth: string = '';

    public sizeDiameterUserCar: Array<any> = [];;
    public sizeProfUserCar: Array<any> = [];;
    public sizeWidthUserCar: Array<any> = [];;

    public searchParameters: SearchParameters = new SearchParameters();
    public tiresParam: TiresParam = new TiresParam();
    private filterType: Array<string> = ['Tire_Diameter', 'Tire_FrameSize', 'Tire_Season'];

    public filterAll$: Observable<Array<GroupModel>>;
    public filterWithAndProf$: Observable<Array<StrKeyValueModel>>;

    public filterAllForNotTruck$: Observable<Array<GroupModel>>;
    public filterWithAndProfForNotTruck$: Observable<Array<StrKeyValueModel>>;
    public tiresSizeKeyValueForNotTruck: Array<StrKeyValueModel> = [];

    public filterAllForTruck$: Observable<Array<GroupModel>>;
    public filterWithAndProfForTruck$: Observable<Array<StrKeyValueModel>>;
    public tiresSizeKeyValueForTruck: Array<StrKeyValueModel> = [];

    public diametrKeyValue: Array<StrKeyValueSizeModel> = [];
    public tiresSizeKeyValue: Array<StrKeyValueModel> = [];
    public filterUserCar: Array<StrKeyValueModel>;

    @Output() outTireSizeKeyValue = new EventEmitter<Array<StrKeyValueModel>>();
    @Output() outTireSizeDiameter = new EventEmitter<Array<StrKeyValueModel>>();

    public urlFilter: string = '';
    public url: string = 'shiny-id49-3';
    public formFactor = '';
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private regexpWidtProf = /([0-9]{2,4})\/([0-9]{2,4})/g;
    public userCar: UserCar;
    public comboboxes$: Observable<GenericFilterModel[]>;
    public dropdowns$: Observable<DropdownFilterModel[]>;
    

    constructor(
        private _filterService: FiltersService,
        private __alertService: AlertService,
    ) {
        this.seasonality = ['tltd0l4u8-zima', 'tltd0l4u8-leto', 'tltd0l11u1024-vsesezonnaja'];
    }

    ngOnInit() {
        this.initSearchParam();

        let  params = {
            "filterType": 'Tire_Diameter',
            "jsonGetParams": JSON.stringify(this.searchParameters)
       };

        this.filterAll$ = this._filterService.getAllFilter(params); 
        this.filterAll$.pipe(takeUntil(this.destroy$)).subscribe(data => {
            this.diametrKeyValue = data.filter(x => x.groupKey == 2)[0].values;
            this.outTireSizeDiameter.emit(this.diametrKeyValue);
            this.diametrKeyValue.forEach(val => {
                this.diameterList.push(val.value);
            });

            let tireSize = data.filter(x => x.groupKey == 3)[0].values;
            this.outTireSizeKeyValue.emit(tireSize);
            this.tiresSizeKeyValue = this.prepareKVP(tireSize);  

            this.sliceParam(this.tiresSizeKeyValue, this.widthList);
        });

        this.searchParameters.formFactor = 0;
        params.jsonGetParams = JSON.stringify(this.searchParameters)
        this.filterAllForNotTruck$ = this._filterService.getAllFilter(params);
        this.filterAllForNotTruck$.pipe(takeUntil(this.destroy$)).subscribe(data => {
            let diameters = data.filter(x => x.groupKey == 2)[0].values;
            diameters.forEach(val => {
                this.diameterListForNotTruck.push(val.value);
            });

            let tireSize = data.filter(x => x.groupKey == 3)[0].values;
            this.tiresSizeKeyValueForNotTruck = this.prepareKVP(tireSize);
            this.sliceParam(this.tiresSizeKeyValueForNotTruck, this.widthListForNotTrack); 
        });
    }

    private initSearchParam(): void {
        this.searchParameters.categoryUrl = 'shiny-id49-3';
        this.searchParameters.formFactor = 2;
        this.searchParameters.selectedCategory = 'tires';
        this.searchParameters.sortOrder = 1;
        this.searchParameters.artId = 0;
        this.searchParameters.count = 20;
        this.searchParameters.treeParts.push(49);
    }
    
    private sliceParam(data: Array<StrKeyValueModel>, width: any): void {
        let helper: string[];
        data.forEach(val => {
            helper = val.value.split('/');

            if (!width.includes(helper[0])) {
                width.push(helper[0]);
            }
        });
    }

    public prepareKVP(arr: StrKeyValueModel[]): StrKeyValueModel[] {
        return arr.filter(val => this.regexpWidtProf.test(val.value));
    }

    public getDiameterList(diameterList: string[]): string[] {
        if (this.userCar == null) {
            if (this.isTruck) {
                if (this.sizeDiameter != '' && this.diameterListForTruck) {
                    return this.diameterListForTruck.filter(param => param.includes(this.sizeDiameter));
                }

                return this.diameterListForTruck;
            }
            else {
                if (this.sizeDiameter != '' && this.diameterListForNotTruck) {
                    return this.diameterListForNotTruck.filter(param => param.includes(this.sizeDiameter));
                }

                return this.diameterListForNotTruck;
            }          
        }
        else {
            if (this.sizeDiameter != '' && this.sizeDiameterUserCar) {
                return this.sizeDiameterUserCar.filter(param => param.includes(this.sizeDiameter));
            }
            return this.sizeDiameterUserCar;
        }              
    }

    public getWidthList(widthList: string[]): string[] {
        if (this.userCar == null) {
            if (this.isTruck) {
                if (this.sizeWidth != '' && this.widthListForTrack) {
                    return this.widthListForTrack.filter(param => param.includes(this.sizeWidth));
                }

                return this.widthListForTrack;           
            }
            else
            {
                if (this.sizeWidth != '' && this.widthListForNotTrack) {
                    return this.widthListForNotTrack.filter(param => param.includes(this.sizeWidth));
                }

                return this.widthListForNotTrack;
            }
            
        }
        else {
            if (this.sizeWidth != '' && this.sizeWidthUserCar) {
                return this.sizeWidthUserCar.filter(param => param.includes(this.sizeWidth));
            }

            return this.sizeWidthUserCar;
        }
    }

    public getWidthProf(): StrKeyValueModel[] {
        if (this.userCar == null) {
            if (this.isTruck) {
                if (this.sizeWidth != '' && this.tiresSizeKeyValueForTruck) {
                    return this.tiresSizeKeyValueForTruck.filter(val => val.value.startsWith(this.sizeWidth + '/'));
                }

                return this.tiresSizeKeyValueForTruck;
            }
            else {
                if (this.sizeWidth != '' && this.tiresSizeKeyValueForNotTruck) {
                    return this.tiresSizeKeyValueForNotTruck.filter(val => val.value.startsWith(this.sizeWidth + '/'));
                }

                return this.tiresSizeKeyValueForNotTruck;
            }
        }
        else {
            if (this.sizeWidth != '' && this.tiresSizeKeyValue) {
                return this.filterUserCar.filter(val => val.value.startsWith(this.sizeWidth + '/'));
            }

            return this.filterUserCar;
        }      
    }

    public applyParamSearch(): void {
        this.searchByMarkAuto = !this.searchByMarkAuto;    
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    public applyTruck(): void  {

        if(this.diameterListForTruck){
            let  params = {
                "filterType": 'Tire_Diameter',
                "jsonGetParams": JSON.stringify(this.searchParameters)
            };
            this.searchParameters.formFactor = 1;
            params.jsonGetParams = JSON.stringify(this.searchParameters)
            this.filterAllForTruck$ = this._filterService.getAllFilter(params);
            this.filterAllForTruck$.pipe(takeUntil(this.destroy$)).subscribe(data => {
                let diameters = data.filter(x => x.groupKey == 2)[0].values;
                diameters.forEach(val => {
                    this.diameterListForTruck.push(val.value);
                });

                let tireSize = data.filter(x => x.groupKey == 3)[0].values;
                this.tiresSizeKeyValueForTruck = this.prepareKVP(tireSize);
                this.sliceParam(this.tiresSizeKeyValueForTruck, this.widthListForTrack);
            });
        }

        this.isTruck = !this.isTruck;
        this.tiresParam.formFactor = (this.isTruck ? '-1' : '-2');

        this.sizeDiameter = '';
        this.sizeProf = '';
        this.sizeWidth = '';

        this.turnOffAll();
    }

    public applaySeason(season: number): void {
        this.seasonalityState = season;
        this.tiresParam.Tire_Season = this.seasonality[season];

        this.turnOffAll();
    }

    public selectWidth(widthValue: string): void {
        this.showDropDown1 = false;
        this.sizeWidth = widthValue;              
    }

    public selectProf(profValue: string): void {
        this.showDropDown2 = false;
        this.sizeProf = profValue;
        this.tiresParam.Tire_FrameSize = this.sizeWidth + '/';

        this.tiresParam.Tire_FrameSize += profValue;
        
        let filterTypeKey = this.tiresSizeKeyValue.find(o => o.value == this.tiresParam.Tire_FrameSize);

        if (filterTypeKey != undefined) {
            this.tiresParam.Tire_FrameSize = filterTypeKey.key;
        } 
    }

    public selectDiameter(diameterValue: string): void {
        this.showDropDown3 = false;
        this.sizeDiameter = diameterValue;
        this.tiresParam.Tire_Diameter = this.diametrKeyValue.find(o => o.key == diameterValue).key;
    }

    public toggleDropdownWidt(): void {
        this.showDropDown1 = !this.showDropDown1;
        this.showDropDown2 = false;
        this.showDropDown3 = false;
    }

    public toggleDropdownProf(): void {
        if (this.sizeWidth !='') {
            this.showDropDown2 = !this.showDropDown2;
        }
        this.showDropDown1 = false;
        this.showDropDown3 = false;
    }

    public toggleDropdownDiameter(): void {
        this.showDropDown3 = !this.showDropDown3;
        this.showDropDown1 = false;
        this.showDropDown2 = false;
    }

    public turnOffAll():void {
        this.showDropDown1 = false;
        this.showDropDown2 = false;
        this.showDropDown3 = false;
    }

    public getRoutParams(): string[] {
        return ['category', 'shiny-id49-3'];
    }

    public getQueryParams(): Object{
        return this.tiresParam as Object;
    }

    public onSelectCar(car: any) {
        this.sizeDiameter = '';
        this.sizeProf = '';
        this.sizeWidth = '';

        this.userCar = car;
        this.applyParamSearch();

        let carObj: string[] = [car[0].key, car[1].key, car[2].key];
        
        this._filterService.getFilterOptionsCar(this.filterType[1], carObj).pipe(takeUntil(this.destroy$)).subscribe(data => {

            if (data.length == 0) {
                this.__alertService.success("К сожалению, по данному авто не предусмотрен подбор по параметрам");
                this.userCar = null;

                return;
            }

            this.filterUserCar = data;

            this.sizeDiameterUserCar = [];
            this.sizeWidthUserCar = [];
            this.sizeProfUserCar = [];

            if (data.length == 0) {
                this.filterUserCar = this.tiresSizeKeyValue;
                this.sizeDiameterUserCar = this.diameterList;
                this.sizeWidthUserCar = this.widthList;
            }
            data.forEach(kvp => {
                if (!this.sizeDiameterUserCar.includes(kvp.key)) {
                    this.sizeDiameterUserCar.push(kvp.key);
                }

                let helper = kvp.value.split('/');
                if (!this.sizeWidthUserCar.includes(helper[0])) {
                    this.sizeWidthUserCar.push(helper[0]);
                }
                if (!this.sizeProfUserCar.includes(helper[1])) {
                    this.sizeProfUserCar.push(helper[1]);
                }
                
            });
            this.sizeDiameterUserCar.sort();
            this.sizeWidthUserCar.sort();
            this.sizeProfUserCar.sort();
        }); 
    }
}
