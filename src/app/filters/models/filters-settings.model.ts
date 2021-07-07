import { FiltersBlockModel } from './filters-block.model';
import { FilterTypesEnum } from './filter-types.enum';

export class FiltersSettingsModel {
    suitableVehiclesFilterEnabled: boolean = true;
    //manufacturerFilterTypeId: number = FilterTypesEnum.Uncategorized_Manufacturer;
    //searchType: number = 0;
    filterBlocksList: Array<FiltersBlockModel> = [];
}