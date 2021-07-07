import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { Settlement } from '../location/location.model';
import { MapsAPILoader } from '@agm/core';

declare var google: any;

@Injectable()
export class GoogleMapsGeocodingService {
    private _geocodedObject: Subject<any> = new Subject<any>();
    private _geolocationObject: Subject<Position> = new Subject<Position>();
    private _currentGeolocationBounds: any;

    constructor(
         @Inject(PLATFORM_ID) private platformId: Object,
          private _loader: MapsAPILoader) {
    }

    private populateClientPosition(): Observable<Position> {

        if (isPlatformBrowser(this.platformId)) {
            navigator.geolocation.getCurrentPosition(
                (geoloc) => {
                    this._geolocationObject.next(geoloc);
                    this._geolocationObject.complete();
                }
            );
        }

        return this._geolocationObject;
    }

    private geocoderResponse(results, status): void {
        if (status == google.maps.GeocoderStatus.OK) {
            this._currentGeolocationBounds = results.filter(this.localityCheck.bind(this))[0].geometry.viewport;
            this._geocodedObject.next(this.getName(results));
            this._geocodedObject.complete();
        }
    }

    private areaResponse(results, status): void {
        if (status == google.maps.GeocoderStatus.OK) {
            this._currentGeolocationBounds = results.filter(this.localityCheck.bind(this))[0].geometry.viewport;
            this._geocodedObject.next(this.getAreaName(results));
            this._geocodedObject.complete();
        }
    }

    private localityCheck(item: any): any {
        return item.types[0] == "locality";
    }

    private getName(position: any): string {
        var namearr = position.filter(this.localityCheck.bind(this))[0].address_components.filter(this.localityCheck.bind(this)).map(i => i.short_name);

        return namearr[0];
    }

    private getAreaName(positions: GPosition[]): string {
        const areaType: string = "administrative_area_level_1";
        const area = positions.filter(p => p.types.includes(areaType));
        const fullName = (area.length && area[0]) ? area[0].formatted_address : null;
        if (!fullName) {
            return "";
        }
        const endIdx = fullName.indexOf(" область");
        const areaName = fullName.substring(0, endIdx);
        return areaName;
    }

    public getGeocodedClientPosition(): Observable<string> {
        this._loader.load().then(() => {
            this.populateClientPosition().subscribe((data) => {
                let geocoder = new google.maps.Geocoder();
                //let latlng = new google.maps.LatLng(49.262358, 24.627817);
                let latlng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
                geocoder.geocode({ 'latLng': latlng }, this.geocoderResponse.bind(this));
            });
        });
        return this._geocodedObject;
    }

    public getClientArea(): Observable<string> {
        this._loader.load().then(() => {
            this.populateClientPosition().subscribe((data) => {
                let geocoder = new google.maps.Geocoder();
                //let latlng = new google.maps.LatLng(49.262358, 24.627817); test
                let latlng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
                geocoder.geocode({ 'latLng': latlng }, this.areaResponse.bind(this));
            });
        });
        return this._geocodedObject;
    }

    public findSettlemntInBounds(settlemntsArray: Array<Settlement>): Settlement {
        let determinedSettlemnt = null;

        settlemntsArray.forEach(item => {
            let latlng = new google.maps.LatLng(item.latitude, item.longitude);
            determinedSettlemnt = this._currentGeolocationBounds.contains(latlng) ? item : null;
        })

        return determinedSettlemnt;
    }
}

class GPosition {
    formatted_address: string;
    types: string[];
}