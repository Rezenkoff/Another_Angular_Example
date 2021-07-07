export class ShipmentType {
    Id: number;
    ShipmentName: string;
    Key: number;
    Cost: number;
    DeliveryPointCount: number;
    IsFreeFrom: number;
    isAvaiable: boolean = true;

    constructor(id: number, name: string, key: number, deliveryPointCount: number, cost?: number, isFreeFrom?: number) {
        this.Id = id;
        this.ShipmentName = name;
        this.Key = key;
        this.Cost = cost || 0;
        this.DeliveryPointCount = deliveryPointCount;
        this.IsFreeFrom = isFreeFrom;
    }
}