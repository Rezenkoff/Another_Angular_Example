import { Injectable, EventEmitter } from '@angular/core';
import { ILiqpayService } from './liqpay-interface.service';


@Injectable()
export class LiqpayService implements ILiqpayService {
    private liqPayCheckout: any;
    public onCallback: EventEmitter<any> = new EventEmitter<any>();
    public onClose: EventEmitter<any> = new EventEmitter<any>();
    public onReady: EventEmitter<any> = new EventEmitter<any>();

    public set LiqPayCheckout(liqpaycheckout: any) {
        this.liqPayCheckout = liqpaycheckout;
    }

    public onLiqpayCallback(data: any): void {
        this.onCallback.emit(data);
    }

    public onLiqpayClose(data: any): void {
        this.onClose.emit(data);
    }

    public onLiqpayReady(data: any): void {
        this.onReady.emit(data);
    }

    public initCheckout(signeddata: any,phone: string): void {

        this.liqPayCheckout.init({
            data: signeddata.data,
            signature: signeddata.signature,
            embedTo: "#liqpay_checkout",
            language: "ru",
            mode: "popup"
        }).on("liqpay.callback", (data) => {
            data.user.phone = phone;
            this.onLiqpayCallback(data);
        }).on("liqpay.ready", (data) => {
            this.onLiqpayReady(data);
        }).on("liqpay.close", (data) => {
            this.onLiqpayClose(data);
        });
    }
}



