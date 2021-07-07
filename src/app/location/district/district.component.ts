import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { LanguageService } from "../../services/language.service";
import { DistrictService } from "./district.service";
import { takeUntil, map, debounceTime, distinctUntilChanged, finalize, catchError } from "rxjs/operators";
import { DistrictModel } from "./district.model";
import { BaseLoader } from "../../shared/abstraction/loaderbase.component";
import { AreaService } from "../area/area.service";

const minCharsCount = 3;
const timeout = 1000;

@Component({
    selector: 'district',
    templateUrl: './__mobile__/district.component.html'
})
export class DistrictComponent extends BaseLoader {
    @Input() deliveryMethodKey$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
    @Input() areaId$: Observable<number> = new Observable<number>();
    @Input() isActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    @Output() districtSelected: EventEmitter<DistrictModel> = new EventEmitter<DistrictModel>();

    private termSearch: Subject<string> = new Subject<string>();
    public districtsList$: Observable<DistrictModel[]> = new Observable<DistrictModel[]>();
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private _languageId = 2;
    public selectedName: string = "";
    public _areaId: number = null;
    public _deliveryMethodKey: number = null;
    public showDropDown: boolean = false;

    public exampleDistrictName: string = "";
    private _isSearchFromExample: boolean = false;

    constructor(private _languageService: LanguageService,
        private _districtService: DistrictService,
        private _areaService: AreaService) {
        super();
    }

    ngOnInit() {
        let language = this._languageService.getSelectedLanguage();
        this._languageId = (language) ? language.id : 2;

        this._languageService.languageChange.pipe(takeUntil(this.destroy$)).subscribe(language => {
            this._languageId = language.id;
            this.districtsList$ = this.districtsList$.pipe(map(list => this.translateDistricts(list)));
        });

        this.termSearch.pipe(takeUntil(this.destroy$),
            debounceTime(timeout),
            distinctUntilChanged(),
            map((term: string) => {
                if (term.length >= minCharsCount) {
                    this.searchDistrict();
                }
            })).subscribe();

        this.areaId$.pipe(takeUntil(this.destroy$)).subscribe(id => {
            if (this._areaId == id)
                return;
            this.selectedName = "";
            this._areaId = id;
            this.districtsList$ = of([])
            this.searchDistrict();
            this.changeExampleDistrict();
        });

        this.deliveryMethodKey$.pipe(takeUntil(this.destroy$)).subscribe(key => {
            this._deliveryMethodKey = key;
            this.selectedName = "";
            this.districtsList$ = of([])
            this.searchDistrict();
            this.changeExampleDistrict();
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    private translateDistricts(district: DistrictModel[]): DistrictModel[] {
        district.map(x => this.translate(x));
        return district;
    }

    private translate(district: DistrictModel): DistrictModel {
        district.districtName = (this._languageId == 2) ? district.districtRU : district.districtUA;
        return district;
    }

    public searchDistrictOnKey() {
        this.termSearch.next(this.selectedName);
    }

    public searchDistrict() {
        if (!this._areaId)
            return;

        if (this._deliveryMethodKey) {
            this.StartSpinning();
            this._districtService.getDistrics(this._areaId, this.selectedName, this._deliveryMethodKey, this._languageId).pipe(
                takeUntil(this.destroy$),
                map(districts => {
                    this.districtsList$ = of(this.translateDistricts(districts));
                    if (this._isSearchFromExample && districts.length > 0) {
                        this.selectDistrict(districts[0]);
                    }
                }),
                finalize(() => {
                    this.EndSpinning();
                    if (this._isSearchFromExample) {
                        this._isSearchFromExample = false;
                        this.showDropDown = false;
                    }
                    else {
                        this.showDropDown = true;
                    }
                }),
                catchError(error => {
                    return [];
                })
            ).subscribe();
        }
    }

    public selectDistrict(district: DistrictModel) {
        this.selectedName = (district) ? district.districtName : "";
        this.showDropDown = false;
        this.districtSelected.next(district);
    }

    public togglePopup() {
        this.showDropDown = !this.showDropDown;
    }

    public searchByExampleName(): void {
        this.selectedName = this.exampleDistrictName;
        this.searchDistrict();
        this._isSearchFromExample = true;
    }

    private changeExampleDistrict() {
        this.exampleDistrictName = "";
        this._areaService.getAreaById(this._areaId).subscribe(result => {
            if (result) {
                this.exampleDistrictName = result.defaultCityName;
            }
        });
    }
}