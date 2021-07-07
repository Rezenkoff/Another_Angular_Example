import { NgModule } from '@angular/core';
import { SharedCommonModule } from '../shared/modules/shared-common.module';
//import { SharedModule } from '../shared/modules/shared.module';
import { GoogleMapsService } from './google-maps.service';
import { GoogleMapsGeocodingService } from './google-maps-geocoding.service';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        SharedCommonModule, 
        //SharedModule, 
        CommonModule
    ],
    providers: [
       GoogleMapsService, GoogleMapsGeocodingService
    ]
})
export class GoogleMapsModule { }

