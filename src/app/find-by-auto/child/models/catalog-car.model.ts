import { CatalogAttribute } from './catalog-attribute.model';

export class CatalogCar {
    brand: string;
    name: string;
    catalog: string;
    ssd: string;
    vehicleId: number;
    vehicleidSpecified: boolean;
    attribute: Array<CatalogAttribute>;
    attributes: Object;

    constructor(brand?: string, name?: string, catalog?: string, ssd?: string, vehicleId?: number, vehicleidSpecified?: boolean, attribute?: Array<CatalogAttribute>) {
        this.brand = brand;
        this.name = name;
        this.catalog = catalog;
        this.ssd = ssd;
        this.vehicleId = vehicleId;
        this.vehicleidSpecified = vehicleidSpecified;
        this.attribute = attribute;
    }
}