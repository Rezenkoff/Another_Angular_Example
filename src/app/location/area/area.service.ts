import { Injectable, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { Area } from './area.model';
import { UserStorageService } from '../../services/user-storage.service';
import { map, share } from 'rxjs/operators';
import { Observable, of, forkJoin, BehaviorSubject } from 'rxjs';
import { GoogleMapsGeocodingService } from '../../google-maps/google-maps-geocoding.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../models/api-response.model';
import { LanguageService } from '../../services/language.service';
import { isPlatformServer } from '@angular/common';
import * as defaultPrefs from '../../config/default-user-preferences'
import { environment } from '../../../environments/environment';

const areaKey: string = "selectedArea";

@Injectable()
export class AreaService {

    public areaChanged: EventEmitter<Area> = new EventEmitter<Area>();
    private _areas: Area[] = [];
    private _areas$: Observable<any>;
    private _area: Area;
    private _languageId: number = 2;
    private _selectedArea$: BehaviorSubject<Area> = new BehaviorSubject<Area>(null);

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _http: HttpClient,
        private _userStorageService: UserStorageService,
        private _googleService: GoogleMapsGeocodingService,
        private _languageService: LanguageService
    ) {
        _languageService.languageChange.subscribe(() => {
            this._languageId = this._languageService.getSelectedLanguage().id;
            this.translateAreas();
        });
    }

    public getPopularAreas(): Observable<Area[]> {
        return this.getAreas().pipe(map(areas => areas.filter(x => x.isFavorite == true)));
    }

    public getAreaById(areaId: number): Observable<Area> {
        return this._areas$.pipe(map(areas => areas.find(x => x.areaId == areaId)));
    }

    public findAreas(term: string): Observable<Area[]> {
        if (!term) {
            return this.getAreas();
        }
        term = term.toLowerCase();
        return this.getAreas().pipe(map(areas =>
            areas.filter(x => x.areaNameRus.toLowerCase().startsWith(term) || x.areaNameUkr.toLowerCase().startsWith(term))));
    }

    public getAreas(): Observable<Area[]> {
        if (this._areas.length) {
            return of(this._areas);
        } 
        this._areas$ = this._http.get(environment.apiUrl + 'delivery/areas').pipe(
            share(),
            map((response: ApiResponse) => {
            if (!response.success || !response.data) {
                return [];
            }
            this._areas = response.data as Area[];
            this.translateAreas();
            return this._areas;
            }));

        return this._areas$;
    }

    public getSelectedArea(): Observable<Area> {
        if (isPlatformServer(this.platformId)) {
            return of(null);
        }

        if (this._area) {
            this._selectedArea$.next(this._area);
        }
        this._area = this._userStorageService.getData(areaKey);
        if (this._area) {
            this._selectedArea$.next(this._area);
        }
        this.getUserArea().subscribe(area => {
            this.setSelectedArea(area);
        });
 
        return this._selectedArea$;
    }

    public getNearestStoreAreaName(): Observable<string> {
        if (isPlatformServer(this.platformId)) {
            return of(defaultPrefs.defaultNearestStoreAreaName);
        }        
        return this.getSelectedArea().pipe(map((area) => {
            return (area) ? area.nearestStoreAreaKey : defaultPrefs.defaultNearestStoreAreaName;
        }));
    }

    public setSelectedArea(area: Area): void {
        this._area = area;
        this._selectedArea$.next(this._area);
        this._userStorageService.upsertData(areaKey, this._area);
        this.areaChanged.emit(this._area);
    }

    private getUserArea(): Observable<Area> {
        if (this._area) {
            return of(this._area);
        }

        return forkJoin(
            this.getAreas(),
            this._googleService.getClientArea()
        ).pipe(map(result => {
            const areas = result[0] as Area[];
            const areaName = result[1] as string;
            this._area = areas.find(x => x.areaNameRus == areaName || x.areaNameUkr == areaName);
            if (!this._area) {
                this._area = areas.find(x => x.areaNameRus == defaultPrefs.defaultArеaName);
            }
            return this._area;
        }));
    }

    private translateAreas(): void {
        if (!this._areas.length) {
            return;
        }
        const translated = this._areas.map(area => {
            area.areaName = this._languageId == 2 ? area.areaNameRus : area.areaNameUkr;
            return area;
        });
        this._areas = [...translated];

        if (!this._area) {
            return;
        }
        this._area.areaName = this._languageId == 2 ? this._area.areaNameRus : this._area.areaNameUkr;
        this._selectedArea$.next(this._area);
    }
}