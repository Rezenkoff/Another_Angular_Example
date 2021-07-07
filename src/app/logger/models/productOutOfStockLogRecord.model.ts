import { BaseLogRecordModel } from './baseLogRecord.model';
import { LogEntryType } from './logEntryType.enum';

export class ProductOutOfStockRecordModel extends BaseLogRecordModel {

    public productIds: number[];

    constructor(productIds: number[]) {
        super(LogEntryType.ProductOutOfStock);
        this.productIds = productIds;
    }
}