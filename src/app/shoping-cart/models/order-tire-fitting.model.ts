export class OrderTireFitting {
    constructor(date: string, time: string){
        this.tireFittingDate = date;
        this.tireFittingTime = time;
    }
    public tireFittingOrderSelected: boolean = false;
    public tireFittingDate: string = "";
    public tireFittingTime: string = "";
    public fittigDate: Date;
}
