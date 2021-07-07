import { FilterTypesEnum } from '../../filters/models/filter-types.enum';

export interface ICarFilterKeys {
    markKey: string;
    serieKey: string;
    yearKey: string;
    modelKey: string;
    modifKey: string;
}

export const CarFilterKeys: ICarFilterKeys = {
    markKey: FilterTypesEnum[FilterTypesEnum.SuitableVehicles_Mark],
    serieKey: FilterTypesEnum[FilterTypesEnum.SuitableVehicles_Serie],
    yearKey: FilterTypesEnum[FilterTypesEnum.SuitableVehicles_Year],
    modelKey: FilterTypesEnum[FilterTypesEnum.SuitableVehicles_Model],
    modifKey: FilterTypesEnum[FilterTypesEnum.SuitableVehicles_Modif],
}