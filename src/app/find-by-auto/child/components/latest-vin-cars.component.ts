import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogCar } from '../models/catalog-car.model';
import { LastInfoService } from '../../../order-step/last-info.service';
import { APP_CONSTANTS, IAppConstants } from '../../../config';

@Component({
    selector: 'latest-vin-cars',
    templateUrl: './__mobile__/latest-vin-cars.component.html'
})

export class LatestVinCarsComponent implements OnInit {

    @Input() vin: string;
    @Input() isAuthorized: boolean = false;
    public latestCars: Array<CatalogCar> = new Array<CatalogCar>();;
    public noLatestCarsFound: boolean = false;    

    constructor(
        @Inject(APP_CONSTANTS) private _constants: IAppConstants,  
        private _lastInfoService: LastInfoService,
        private _router: Router
    ) {}

    ngOnInit() {
        this._lastInfoService.getLatestVinSearchVehicles()
            .subscribe(array => {
                this.latestCars = array;
                this.setNoLatestCars();
            });      
    }

    public getLogo(mark: string): string {
        if (!mark) {
            return;
        }            
        return this._constants.IMAGES.VIN_MODEL_CABINET + mark + '.PNG';
    }

    public onCarSelected(vinSearchCar: CatalogCar) {
        let queryParams = { ssd: vinSearchCar.ssd, code: vinSearchCar.catalog, vehicleId: vinSearchCar.vehicleId, brand: vinSearchCar.brand, vinCode: this.vin };
        this._router.navigate(['detail-groups', queryParams]);
    }

    public setNoLatestCars(): void {
        this.noLatestCarsFound = !this.isAuthorized && !Boolean(this.latestCars.length);        
    }
}