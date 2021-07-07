export class Area {
    public areaId: number;
    public nearestStoreAreaId: number;
    public nearestStoreAreaKey: string;    
    public areaName: string;
    public areaNameUkr: string;
    public areaNameRus: string;
    public isFavorite: boolean;
    public defaultCityName: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}