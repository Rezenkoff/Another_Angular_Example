import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from "@angular/core";
import { Subject, Observable, BehaviorSubject, of } from "rxjs";
import { debounceTime, distinctUntilChanged, catchError, map, finalize, takeUntil } from "rxjs/operators";
import { BaseLoader } from "../../shared/abstraction/loaderbase.component";
import { SettlementModel } from "./settlement.model";
import { SettlementService } from "./settlement.service";
import { LanguageService } from "../../services/language.service";
import { AlertService } from "../../services/alert.service";
import * as defaultPrefs from '../../config/default-user-preferences';
import { HttpLocationService } from "../http-location.service";
const minCharsCount = 3;
const timeout = 1000;

@Component({
    selector: 'settlement-dropdown',
    templateUrl: './__mobile__/settlement-dropdown.component.html'
})
export class SettlementDropdownComponent extends BaseLoader implements OnInit, OnDestroy 
{

    @Input() deliveryMethodKey$: Observable<number> = new Observable<number>();
    @Input() isActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    @Input() selectedSettlementKey$: Observable<string> = new Observable<string>();

    @Output() settlementSelected: EventEmitter<SettlementModel> = new EventEmitter<SettlementModel>();

    public selectedName: string = "";
    public showDropDown: boolean = false;
    public settlementsList$: Observable<SettlementModel[]> = new Observable<SettlementModel[]>();
    public exampleSettlements: string[] = [];
    private _searchTerms: Subject<string> = new Subject<string>();
    private _languageId = 2;
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    private _deliveryKey: number = null;
    private _selectedKey: string = null;

    constructor(
        private _settlementService: SettlementService,
        private _languageService: LanguageService,
        private _alertService: AlertService,
        private _locationService: HttpLocationService,
    ) { super(); }

    ngOnInit() {
        let language = this._languageService.getSelectedLanguage();
        this._languageId = (language) ? language.id : 2;

        this._searchTerms.pipe(
            takeUntil(this._destroy$),
            debounceTime(timeout),
            map((term: string) => {
                if (term.length >= minCharsCount) {
                    this.searchSettlements();
                }
            })).subscribe();

        this._languageService.languageChange.pipe(takeUntil(this._destroy$)).subscribe(language => {
            this._languageId = language.id;
                this.settlementsList$ = this.settlementsList$.pipe(map(list => this.translateSettlements(list)));
        });

        this.deliveryMethodKey$.pipe(distinctUntilChanged(), takeUntil(this._destroy$)).subscribe(key => {
            this._deliveryKey = key;
            let prevName = this.selectedName;
            this.selectSettlement(null);
            if (prevName.length && key == defaultPrefs.novaPoshtaDeliveryKey) {
                this.selectedName = prevName.split(',')[0].replace('город ', '');
                this.searchSettlements();
            }
        });

        this.selectedSettlementKey$.pipe(takeUntil(this._destroy$)).subscribe(key => {
            if (this._selectedKey == key || this._deliveryKey === defaultPrefs.deliveryJustInKey) {
                return;
            }


            this._settlementService.getSettlementByKey(this._deliveryKey, key, this._languageId).subscribe(settlement => {
                if (settlement) {
                    settlement = this.translate(settlement);
                    this.selectSettlement(settlement);
                }
            });
        });

        this.initExampleSettlements();
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    private searchSettlements(): void {
        if (!this._deliveryKey) {
            return;
        }

        this.StartSpinning();

        this._settlementService.getSettlements(this._deliveryKey, this.selectedName, this._languageId).pipe(
            map(settlements => {
                this.settlementsList$ = of(this.translateSettlements(settlements ?? []));
            }),
            finalize(() => {
                this.EndSpinning();
                this.showDropDown = true;
            }),
            catchError(error => {
                return [];
            })
        ).subscribe();
    }

    private translateSettlements(settlements: SettlementModel[]): SettlementModel[] {
        settlements.map(x => this.translate(x));
        return settlements;
    }

    private translate(settlement: SettlementModel): SettlementModel {
        settlement.name = (this._languageId == 2) ? settlement.nameRus : settlement.nameUkr;
        return settlement;
    }

    public searchSettlement(): void {
        this._searchTerms.next(this.selectedName);
    }

    public selectSettlement(settlement: SettlementModel): void {
        this._selectedKey = (settlement) ? settlement.cityKey : null;
        this.selectedName = (settlement) ? settlement.name : "";
        this.showDropDown = false;
        this.settlementSelected.emit(settlement);

        if (settlement && settlement.name && this._deliveryKey !== 1 && this._deliveryKey !== 8) {
            this._settlementService.checkIfFreeSettlementsExists(settlement.name.split(',')[0].replace('город ', '')).pipe(takeUntil(this._destroy$))
                .subscribe(result => {
                    if (result.success && result.data) {
                        this._alertService.success("В Вашем городе есть точки выдачи с бесплатной доставкой");
                    }
                });
        }
    }

    public trackByFn(index, item) {
        return index;
    }

    private initExampleSettlements() {
        this._locationService.GetPopularSettlements().subscribe(result => this.exampleSettlements = result.map(x => x.name));
    }

    public searchByExampleName(name: string): void {
        this.selectedName = name;
        this.searchSettlement();
    }
}