
import { Product } from '../models';
import { CartProduct } from '../shoping-cart/models/shoping-cart-product.model';

export function setTranslatedDescription<T extends Product | CartProduct>(product: T, languageName: string) {
    if (!product.displayDescriptionRus) {
        product.displayDescriptionRus = product.displayDescription
    }
    product.displayDescription = (languageName == 'UKR')
        ? product.displayDescriptionUkr || product.displayDescription
        : product.displayDescriptionRus || product.displayDescription;
}


export function setTranslatedAdditionalInfo(product: Product, languageName: string) {
    if (!product.autodocInfoRus) {
        product.autodocInfoRus = product.autodocInfo
    }

    product.autodocInfo = (languageName == 'UKR')
        ? product.autodocInfoUkr
        : product.autodocInfoRus || product.autodocInfo;
}