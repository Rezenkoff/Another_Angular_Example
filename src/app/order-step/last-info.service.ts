import { Injectable } from '@angular/core';
import { OrderStepService } from './order-step.service';
import { ClientInfo } from './models/index';
import { UserCar } from '../vehicle/models/user-car.model';
import { Product } from '../models/product.model';
import { CatalogCar } from '../find-by-auto/child/models/catalog-car.model';
import { AuthHttpService } from '../auth/auth-http.service';
import { UserStorageService } from '../services/user-storage.service';
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import * as carValidator from '../vehicle/models/car-validator-provider';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class LastInfoService {
    private LAST_VEHICLE: string = "LAST_VEHICLE";
    private LAST_USER_INFO: string = "LAST_USER_INFO";
    private LATEST_VEHICLES: string = "LATEST_VEHICLES";
    private LATEST_PRODUCTS: string = "LATEST_PRODUCTS";
    private vehiclesCount: number = 10;
    private productsCount: number = 5;
    private timeout: any;
    private isVinSearchSynced: boolean = false;

    constructor(
        private orderStepService: OrderStepService,
        private _http: HttpClient,
        private _authService: AuthHttpService,
        private _userStorage: UserStorageService) {
    }

    public rememberLastVehicle(): void {
        if (this.orderStepService.OrderStepMainModel.Vehicle)

            this._userStorage.upsertData(this.LAST_VEHICLE, this.orderStepService.OrderStepMainModel.Vehicle);
    }

    public getLastRememberedVehicle(): boolean {
        let saved = this._userStorage.getData(this.LAST_VEHICLE);
        if (saved) {
            this.orderStepService.OrderStepMainModel.Vehicle = SerializationHelper.toInstance(new UserCar(), saved);
            return carValidator.isValidUserCar(this.orderStepService.OrderStepMainModel.Vehicle);            
        }
        return false;
    }

    public rememberVinSearchVehicle(vehicle: CatalogCar): void {
        if (!vehicle) {
            return;
        }
        let vehiclesList = new Array<CatalogCar>();

        let comparatorFn = (carA: CatalogCar, carB: CatalogCar) => {
            return (carA && carB && carA.ssd == carB.ssd) ? true : false;
        }

        vehiclesList = this.processAndGetNewEntry(vehicle, this.vehiclesCount, this.LATEST_VEHICLES, comparatorFn);
        this.updateVinSearchVehiclesInDB(vehiclesList);   
    }

    private updateVinSearchVehiclesInDB(vehiclesList: Array<CatalogCar>) {        
        if (this._authService.isAuthenticated()) {
            let vehiclesJson = JSON.stringify({ historyJson: vehiclesList });
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                //intercept for auth
                this._http.post(environment.apiUrl + 'vehicle/vinSearchHistory', vehiclesJson)
                    .subscribe();
            }, 30000);
        }     
    }

    public getLatestVinSearchVehicles(): Observable<Array<CatalogCar>> { 
        let vehiclesList = new Array<CatalogCar>();

        if (!this.isVinSearchSynced && this._authService.isAuthenticated()) {
            this.isVinSearchSynced = true;

            //intercept 
            return this._http.get<Array<CatalogCar>>(environment.apiUrl + 'vehicle/vinSearchHistory').pipe(
                //change type
                map((resp) => {
                    vehiclesList = resp;
                    this._userStorage.upsertData(this.LATEST_VEHICLES, vehiclesList);
                    return vehiclesList;
                }),
                catchError((error: any) => of(new Array<CatalogCar>()))
                )
            
        } else {
            let saved = this._userStorage.getData(this.LATEST_VEHICLES);
            if (saved) {
                vehiclesList = saved as Array<CatalogCar>;
            }
            return of(vehiclesList);
        }
    }

    public rememberLastUserInfo() {
        if (this.orderStepService.OrderStepMainModel.ContactInfo)
            this._userStorage.upsertData(this.LAST_USER_INFO, this.orderStepService.OrderStepMainModel.ContactInfo);

    }

    public getLastUserInfo(): boolean {
        let userinfo = this._userStorage.getData(this.LAST_USER_INFO);

        if (userinfo) {
            this.orderStepService.OrderStepMainModel.ContactInfo = SerializationHelper.toInstance(new ClientInfo(), userinfo);
            return true;
        } 

        return false;
    }

    public updateProductsHistory(product: Product) {
        if (!product) {
            return;
        }

        let comparatorFn = (productA: Product, productB: Product) => {
            return (productA && productB && productA.id == productB.id) ? true : false;
        }

        this.processAndGetNewEntry(product, this.productsCount, this.LATEST_PRODUCTS, comparatorFn);
    }

    public getProductsHistory(): Array<Product> {
        let products: Array<Product> = this._userStorage.getData(this.LATEST_PRODUCTS) || new Array<Product>();
        return products;
    }

    public processAndGetNewEntry(entry: any, entriesCount: number, entryName: string, comparatorFn: Function): Array<any> {
        let entriesList: Array<any> = new Array<any>();

        let saved = this._userStorage.getData(entryName);
        if (saved) {
            entriesList = saved as Array<any>;
        }

        let entryAlreadyInStore: boolean = this.checkAndUpdateExistingEntry(entry, entriesList, comparatorFn);
        if (entryAlreadyInStore) {
            this._userStorage.upsertData(entryName, entriesList);
            return;
        }

        if (entriesList.length >= entriesCount) {
            entriesList.pop();            
        }
        entriesList.unshift(entry);
        this._userStorage.upsertData(entryName, entriesList);

        return entriesList;
    }

    public getRefId(): number {
        return this._userStorage.getRefId();
    }

    public setRefId(refId: number): void {
        this._userStorage.setRefId(refId);
    }

    private checkAndUpdateExistingEntry(entry: any, entriesList: Array<any>, comparatorFn: Function): boolean {
        let result: boolean = false;

        if (entriesList.length == 0) {
            return false;
        }

        let entryFromStore = entriesList.find(e => comparatorFn(e, entry));
        if (entryFromStore) {
            entryFromStore = entry;
            result = true;
        }

        return result;
    }
}

export class SerializationHelper {
    static toInstance<T>(obj: T, json: any): T {

        if (typeof obj["fromJSON"] === "function") {
            obj["fromJSON"](json);
        }
        else {
            for (var propName in json) {
                obj[propName] = json[propName]
            }
        }

        return obj;
    }
}