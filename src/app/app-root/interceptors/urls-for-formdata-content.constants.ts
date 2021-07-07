import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export const URLS_FOR_FORMDATA = new InjectionToken<Array<string>>('Urls For FormData', {
  providedIn: 'root',
  factory: () => { 
      return [
        'crm/leads/selectme/carcatalog',
        'order/create'
      ].map(i => `${environment.apiUrl}${i}`);
    }
});