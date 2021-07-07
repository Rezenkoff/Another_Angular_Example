import { GenericFilterModel } from '../../filters/models/generic-filter.model';
import { RoutingParametersModel } from '../../models/routing-parameters.model';

export class ComboboxFilterModel extends GenericFilterModel {
    routesDict: Object = {};
    keyword: string = "";
}

export class KeyRoutePair {
    key: string;
    route: RoutingParametersModel;
}