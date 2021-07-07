import { Injectable, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { UserStorageService } from '../services/user-storage.service';
import { Settlement } from './location.model';
import { isPlatformBrowser } from '@angular/common';
import * as defaultPrefs from '../config/default-user-preferences';

const defaultNearestStoreAreaName = defaultPrefs.defaultNearestStoreAreaName;
const defaultLocation: Settlement = defaultPrefs.defaultLocation; 
const settlementKey = "settlement";

@Injectable()
export class LocationService {
    private _selectedLocation: Settlement = null;
    public locationChanged: EventEmitter<Settlement> = new EventEmitter();
    public defaultLongitude = 26.48097;
    public defaultLatitude = 49.23278;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(UserStorageService) public _userStorageService: UserStorageService,
    ) { }

    get selectedLocation(): Settlement {
        return this.getSelectedLocation();
    }

    set selectedLocation(settlement: Settlement) {
        if (settlement) {
            this._selectedLocation = settlement;
            this.setNearestStoreAreaName(this._selectedLocation);
        } else {
            this._selectedLocation = defaultLocation;
        }
        this._userStorageService.upsertData(settlementKey, this._selectedLocation);
        this.locationChanged.emit(this._selectedLocation);
    }

    private setNearestStoreAreaName(location: Settlement): void {
        switch (location.nearestStoreAreaId) {
            case 68:
                location.nearestStoreAreaKey = "Киев";
                break;
            default:
                location.nearestStoreAreaKey = defaultNearestStoreAreaName;
        }
    }

    public getNearestStoreAreaName(): string {
        let location = defaultLocation;

        if (isPlatformBrowser(this.platformId))
            location = this._userStorageService.getData(settlementKey);

        return location.nearestStoreAreaKey || defaultNearestStoreAreaName;
    }

    private getSelectedLocation(): Settlement {
        if (!this._selectedLocation) {
            this._selectedLocation = this._userStorageService.getData(settlementKey);
        }

        return this._selectedLocation || defaultLocation;
    }
}
