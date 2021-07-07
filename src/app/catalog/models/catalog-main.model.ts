import { ICatalogModel, Node } from './';

export class CatalogMainModel implements ICatalogModel {
    catalog: Node[] = new Array<Node>();

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}