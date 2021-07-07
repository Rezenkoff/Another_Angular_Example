import { Component, Output, Inject, EventEmitter } from '@angular/core';
import { APP_CONSTANTS, IAppConstants } from '../../config';
import { BaseLoader } from '../abstraction/loaderbase.component';
import { VinSearchService } from '../../services/vinsearch.service';
import { UserCar } from '../../vehicle/models/user-car.model';
import { OrderStepService } from "../../order-step/order-step.service";
import { finalize, takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { PolisService } from '../../polis/polis.service';
import { Subject } from 'rxjs';
import { AlertService  } from '../../services/alert.service';
import { LanguageService  } from '../../services/language.service';
import { IAlertTranslations, ALERT_TRANSLATIONS } from '../../translate/custom/alert-translation';

const timeout = 1000;

@Component({
    selector: 'vin-search',
    templateUrl: './__mobile__/vin-search.component.html'
})

export class VinSearchComponent extends BaseLoader {

    @Output() onVehicleFinded = new EventEmitter<any>();
    vinModel: string;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public searchterm: Subject<string> = new Subject<string>();

    constructor(@Inject(APP_CONSTANTS) protected constants: IAppConstants,
        private _vinSearchService: VinSearchService,
        public orderStepService: OrderStepService,
        public polisService: PolisService,
        public _alertService: AlertService,
        @Inject(ALERT_TRANSLATIONS) private _translations: IAlertTranslations,
        public _languageService: LanguageService) {
        super();
    }

    ngOnInit() {
        this.searchterm.pipe(takeUntil(this.destroy$),
            debounceTime(timeout),
            distinctUntilChanged(),
            map((term: string) => {
                if (term.length > 3) {
                    if (this.vinModel.length < 10) {
                        this.getCarInfoByNumber();
                    }
                    if (this.vinModel.length == 17)
                        this.onVinSearch();
                }
            })
        ).subscribe();
    }

    public onVinInput(): void {
        this.searchterm.next(this.vinModel);
    }

    public getCarInfoByNumber() {
        this.StartSpinning();

        this.polisService.GetCarInfoByNumber(this.vinModel)
            .pipe(takeUntil(this.destroy$),
            finalize(() => this.EndSpinning()))
            //change type from any
            .subscribe((carInfoResponse:any) => {
            if (carInfoResponse.success && carInfoResponse.data.car.vin) {
                this.vinModel = carInfoResponse.data.car.vin;
                this.onVinSearch();
            }
            else {
                let language = this._languageService.getSelectedLanguage().name;
                let message = this._translations.ERRORS[`car_number_not_found_${language}`] || "По данному номеру ничего не найдено !";
                this._alertService.warn(message);
            }
        });
    }

    public onVinSearch(): void {
        this.StartSpinning();
        this._vinSearchService.SearchByVin(this.vinModel).pipe(
            takeUntil(this.destroy$),
            finalize(() => this.EndSpinning()))
            .subscribe(findedVehicle => {

                if (findedVehicle) {
                    findedVehicle.vin = this.vinModel;
                    this.onVehicleFinded.emit(findedVehicle)
                }
                else {
                    let userCar = new UserCar();
                    userCar.mark = "No";
                    userCar.model = "No";
                    userCar.vin = this.vinModel;
                    this.vinModel = "";

                    this.onVehicleFinded.emit(userCar);
                }

            }, err => {
                this.orderStepService.OrderStepMainModel.Vehicle.vin = this.vinModel;
                this.onVehicleFinded.emit(new UserCar());
            });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
