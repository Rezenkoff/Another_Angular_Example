import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export const URLS_FOR_AUTHENTICATION = new InjectionToken<Array<string>>('Urls For Authentication', {
  providedIn: 'root',
  factory: () => { 
      return [
        'delivery-point/deliverypoints/get',
        'delivery-point/deliverypoints/add',
        'delivery-point/deliverypoints/edit',
        'delivery-point/deliverypoints/paymentEdit',
        'administration/deliverymethods/get',
        'account/update-preferences',
        'product/favoritelist',
        'product/upsert/favorite',
        'product/favoriteproductlist',
        'crm/users/get-managers',
        'cabinet/info',
        'cabinet/order',
        'cabinet/vehicle',
        'cabinet/userdata',
        'cabinet/profile',
        'cabinet/favorite',
        'account/changedata',
        'account/password/change',
        'invoice/get/user',
        'order/delivery',
        'invoice/updateInvoiceProduct',
        'invoice/get/status',
        'vehicle/add',
        'vehicle/get',
        'vehicle/edit',
        'vehicle/disable',
        'cart/products',
        'cart/upsetProducts',
        'cart/products/clear',
        'cart/products',
        'cart/upsetProducts',
        'cart/products',
        'reviews/add',
        'reviews/add-reply',
        'reviews/like',
        'order/delivery',
        'deliveryAuto/areas',
        'deliveryAuto/warehouses'
      ].map(i => `${environment.apiUrl}${i}`);
    }
});