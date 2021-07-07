import { KeyValueModel } from '../../models';
import { KeyValueStrModel } from '../../models/key-value.model';

export class Rest {
    artId: number;
    availableWarehouses: KeyValueModel[];
    unAvailableWarehouses: KeyValueModel[];
    supplierWarehouses: KeyValueStrModel[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}