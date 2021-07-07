import { RestStatusEnum } from '../search/models/rest-status-enum.model';
import { Rest } from '../search/models/rest.model';
import { Area } from '../location/area/area.model';
import * as defaultPrefs from '../config/default-user-preferences';

export class Product {

    id: number;
    price: number;
    oldPrice: number = 0;
    lookupNumber: string;
    displayDescription: string;
    displayDescriptionUkr: string;
    displayDescriptionRus: string;
    cardId: string;
    compulsory: string;
    incDecStep: number;
    brandId: string;
    groupId: number;
    brand: string;
    transliteratedTitle: string;
    is3D: number;
    inStock: boolean;
    analogsCount: number;
    hidePrice: boolean;
    rest: Rest;
    restStatus: RestStatusEnum = RestStatusEnum.NotAvailable;
    restCount: string;
    productLine: string;
    info: string;
    isFavorite: boolean;
    isRecommend: boolean = false;
    image: string;
    autodocInfo: string;
    autodocInfoRus: string;
    autodocInfoUkr: string;
    ref_Key: string;
    hardPackingRate: number;
    weight: number;
    isExpected: number;
    supplierRef_Key: string;
    supplierProductRef_Key: string;
    category: number;
    quantityForDiscount: number;
    discountPrice: number;
    categoryName: string;
    categoryUrl: string;
    brandFilterUrl: string;
    art_type: number;
    isTire: boolean;
    isAvailableProduct: boolean;
    inAnotherProductStore: boolean;
    inAnotherProductPartner: boolean;
    notAvailableProduct: boolean;
    isProductPrice: boolean;
    isPurchaseProductButtonHidden: boolean;
   
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }

    public get isAvailable(): Boolean {
        return Boolean(this.restStatus === RestStatusEnum.Available);
    }

    public get notAvailable() {
        return Boolean(this.restStatus === RestStatusEnum.NotAvailable);
    }

    public get inAnotherStore() {
        return Boolean(this.restStatus === RestStatusEnum.InAnotherStore);
    }

    public get inAnotherPartner() {
        return Boolean(this.restStatus === RestStatusEnum.InAnotherPartner);
    }

    public get isPurchaseButtonHidden() {
        return Boolean(this.restStatus === RestStatusEnum.NotAvailable);
    }

    public get getMajorPrice() {
        return this.price.toFixed(2).toString().replace(/^(\d+).(\d+)/, (...match) => `${match[1]}`);
    }

    public get getMinorPrice() {
        return this.price.toFixed(2).toString().replace(/^(\d+).(\d+)/, (...match) => `${match[2]}`);
    }

    public get isProductPriceDisplayed() {
        return  !this.hidePrice && this.price > 0 ;
    }

    public setRestInfoForProduct(storeArea: Area) : void {

        let storeAreaName = (storeArea) ? storeArea.nearestStoreAreaKey : defaultPrefs.defaultNearestStoreAreaName;

        if (!this.rest && this.isExpected != -1) {
            this.restStatus = RestStatusEnum.NotAvailable;
            return;
        }

        if (!this.rest || (this.rest && !this.rest.availableWarehouses && !this.rest.unAvailableWarehouses) && this.isExpected == -1) {
            this.restStatus = RestStatusEnum.InAnotherPartner;
            return;
        }

        const restsInNearestStore = this.rest.availableWarehouses.find(kvm =>
            kvm.key.toString().toLowerCase().includes(storeAreaName.toLowerCase()));

        if (restsInNearestStore) {
            this.restStatus = RestStatusEnum.Available;
            this.restCount = restsInNearestStore.value;
            return;
        }

        if (this.rest && (this.rest.availableWarehouses.length > 0 || this.rest.unAvailableWarehouses.length > 0)) {
            this.restStatus = RestStatusEnum.InAnotherStore;
            const tiresStore = this.rest.availableWarehouses.find(kvm =>
                kvm.key.toString().includes("(шины)"));

            if (tiresStore) {
                this.restStatus = RestStatusEnum.InAnotherTiresStore;
                return;
            }
        }

        else {
            this.restStatus = RestStatusEnum.NotAvailable;
        }
    }

}

