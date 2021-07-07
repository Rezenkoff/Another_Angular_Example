import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export const URLS_FOR_TRANSFERCACHE = new InjectionToken<any>('Urls For TransferSate', {
  providedIn: 'root',
  factory: () => { 
    let arr = [
        'metaservice/tags',
        'product/article/detail',
        'product/get',
        'catalog/nodebyId',
        'search/articles/prices',
        'search/articles/rests'       
       ].map(i => `${environment.apiUrl}${i}`);

       const dict = {};
       arr.map(i=> dict[i] = true);

      return dict;
    }
});