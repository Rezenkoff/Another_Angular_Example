import { StrKeyValueModel } from '../../models/key-value-str.model';
import { SearchParameters } from '../../search/models/search-parameters.model';

export class FilterPayload {
    filterType: string;    
}

export class BooleanFilterPayload extends FilterPayload {
    boolValue: boolean;
}

export class OptionsFilterPayload extends FilterPayload {
    options: StrKeyValueModel[];
}

export class OptionsRequestPayload extends FilterPayload {
    selectedCategory: string;
    searchParameters: SearchParameters;
}

export class RoutesDictFilterPayload extends FilterPayload {
    routesDict: Object;
}

export class FilterOptionsBySearchTermPayload extends FilterPayload {
    searchTerm: string;
}