import { BaseLogRecordModel } from './baseLogRecord.model';
import { LogEntryType } from './logEntryType.enum';

export class ProductPriceChangedRecordModel extends BaseLogRecordModel {

    public productIds: number[];

    constructor(productIds: number[]) {
        super(LogEntryType.ProductPriceChanged);
        this.productIds = productIds;
    }
}