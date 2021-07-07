import { AddressComponent, Geometry } from ".";

export class Result {
    public address_components: AddressComponent[];
    public formatted_address: string;
    public geometry: Geometry;
    public place_id: string;
    public types: string[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}