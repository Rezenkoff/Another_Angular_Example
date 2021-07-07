import { StrKeyValueModel } from '../../models/key-value-str.model';

export class GenericFilterModel {
    titleRus: string;
    titleUkr: string;
    filterType: string;
    selectedCategoryLabel: string;
    options: Array<StrKeyValueModel> = [];
    optionsFullList: StrKeyValueModel[] = [];
    selectedOptions: Array<StrKeyValueModel> = [];
    loading?: boolean = false;
    isPromoted?: boolean = false;
    positionPriority: number;
    hasLoaded?: boolean = false;
}