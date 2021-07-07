import { Area } from '../../location/area/area.model';
import { SettlementModel } from '../../location/settlement/settlement.model';

export class StoAreaModel extends Area {
    public showSettlements: boolean;
    public settlements: SettlementModel[] = [];
}