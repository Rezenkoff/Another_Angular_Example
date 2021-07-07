import { CartProduct } from '../shoping-cart/models/shoping-cart-product.model';
import { UtmModel } from './utm.model';

export class QuickOrder {
    userPhoneNumber: string;
    currentUrl: string;
    products: string[];
    cartProducts: CartProduct[];
    refId: number;
    clientId: string; 
    utmFields: UtmModel;
    userUid: string;
    transactionId: string;

    constructor(userPhoneNumber: string = '', currentUrl: string = '', products: string[] = [], cartProducts?: CartProduct[], clientId?: string, utmFields?: UtmModel) {
        this.userPhoneNumber = userPhoneNumber;
        this.currentUrl = currentUrl;
        this.products = products;
        this.cartProducts = cartProducts;
        this.utmFields = utmFields;
        this.clientId = clientId;
        this.transactionId = '';
    }
}