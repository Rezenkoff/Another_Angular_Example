import { UserCar } from '../vehicle/models/user-car.model';
import { CarsPanelStateChange } from '../car-select-panel/models/cars-panel-state-change.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable()
export class PromoSliderService {

    constructor(
        private _router: Router,
    ) { }

    public navigateToCarsCatalogWithCar(model: UserCar): void {
        const url = this.getUrlFromUserCar(model);
        this._router.navigateByUrl(url);
    }

    public navigateToCarsCatalog(model: CarsPanelStateChange[]): void {
        const url = this.getUrlFromState(model);
        this._router.navigateByUrl(url);
    }

    private getUrlFromState(panelState: CarsPanelStateChange[]): string {

        let url = '/cars-catalog';
        const markKey = panelState[0].selectedOptions[0].key;
        if (!markKey) {
            return url;
        }
        url += '/' + markKey + '--2000';

        const serieKey = (panelState[1].selectedOptions[0]) ? panelState[1].selectedOptions[0].key : null;
        if (!serieKey) {
            return url;
        }
        url += ('/' + serieKey + '--2001');

        const modelKey = (panelState[2].selectedOptions[0]) ? panelState[2].selectedOptions[0].key : null;
        if (!modelKey) {
            return url;
        }
        url += ('?' + panelState[2].filterType + '=' + modelKey);

        const yearKey = (panelState[3].selectedOptions[0]) ? panelState[3].selectedOptions[0].key : null;
        if (!yearKey) {
            return url;
        }
        url += ('&' + panelState[3].filterType + '=' + yearKey);

        const modifKey = (panelState[4].selectedOptions[0]) ? panelState[4].selectedOptions[0].key : null;
        if (!modifKey) {
            return url;
        }
        url += ('&' + panelState[4].filterType + '=' + modifKey);

        return url;
    }

    private getUrlFromUserCar(car: UserCar): string {

        let url = '/cars-catalog';
        const markKey = car.markKVP.key;
        if (!markKey) {
            return url;
        }
        url += '/' + markKey;

        const serieKey = (car.serieKVP) ? car.serieKVP.key : null;
        if (!serieKey) {
            return url;
        }
        url += ('/' + serieKey);

        const modelKey = (car.modelKVP) ? car.modelKVP.key : null;
        if (!modelKey) {
            return url;
        }
        url += ('?SuitableVehicles_Model=' + modelKey);

        const yearKey = (car.yearKVP) ? car.yearKVP.key : null;
        if (!yearKey) {
            return url;
        }
        url += ('&SuitableVehicles_Year=' + yearKey);

        const modifKey = (car.modifKVP) ? car.modifKVP.key : null;
        if (!modifKey) {
            return url;
        }
        url += ('&SuitableVehicles_Modif=' + modifKey);

        return url;
    }
}