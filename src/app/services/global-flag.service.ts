import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Parcel } from '../models/global-flag.model';

@Injectable()
export class GlobalTransportService {

    private parcelTransport: Subject<Parcel>;

    constructor() { this.createClobalTransportFlag(); }

    private createClobalTransportFlag() {

        this.parcelTransport = new Subject();
    }

    public subscribeToGlobalTransport(): Subject<Parcel> {

        return this.parcelTransport;
    }

    public emitParcel(model: Parcel) {

        this.parcelTransport.next(model);
    }
}

export enum ActionEvent {

    showInfoBlock = 1,
    getOrderInvoices = 2,
    cabinetInfoIsClosed = 3,
    showOnlyMobileCabinet = 4,
    showMainMobileMenu = 5,
    redirectToMainMobileAfterLogin = 6
}