export class UserVehicle{
    model?: string;
    modelId?: number;
    mark?: string;
    markId?: number;
    year?: string;
    stateNumber?: string;
    vin?: string;
    milage?: number;
    isActive?: boolean;
    id?: number;
    
    //constructor(values: Object = {}) {
    //    Object.assign(this, values);
    //}

    public isValid = (): boolean => {
        return Boolean(this.mark);
    }
}