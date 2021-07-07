import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

declare let gtag: Function;

const maxAttempts = 5;

@Injectable()
export class GtagSenderService {

    public sendEvent(parameters: Object, recepientKeys: string[], eventType: string): void {

    let timer = interval(10);
    const maxAttempts = 1000;

    let sub = timer.pipe(take(maxAttempts)).subscribe(() => {
      
      if (typeof (gtag) === "undefined") {
        return;
      }
      parameters = this.prepareNumbers(parameters);

      recepientKeys.forEach(key => {

        if (key != 'AW-801184892' && eventType != "purchase" && environment.production) {
          let params = { ...parameters };
          params['send_to'] = "UA-107152467-4";
          gtag('event', eventType, params);
        }
      });

      recepientKeys.forEach(key => {

        if (key != 'AW-801184892' && environment.production) {

          let params = { ...parameters };
          params['send_to'] = key;
          gtag('event', eventType, params);
        }
      });

      sub.unsubscribe();

    });

  }
   
    public setUid(uid: string, key): boolean {

      if (typeof (gtag) !== 'undefined') {
          gtag('config', key, { 'user_id': uid });

        if (environment.production) {
              gtag('config', "UA-107152467-4", { 'user_id': uid });
          }
          return true;
      }
      return false;
  }

    private prepareNumbers(data: Object): Object {
        if (!data["ecomm_totalvalue"]) {
            return data;
        }
        let total = data["ecomm_totalvalue"];
        if (total) {
            total = Number(Number(total).toFixed(2));
        }
        data["ecomm_totalvalue"] = total;
        return data;
    }
}
