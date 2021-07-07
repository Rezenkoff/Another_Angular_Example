import { BaseLogRecordModel } from './baseLogRecord.model';
import { LogEntryType } from './logEntryType.enum';

export class ShoppingCartLogRecordModel extends BaseLogRecordModel {
    operation: string;
    productId: number;
    //productDescription: string;

    constructor(
        operation: string,
        productId: number,
        //productDescription: string,
        logEntryType: LogEntryType
    ) {
        super(logEntryType);
        this.operation = operation;
        this.productId = productId;
        //this.productDescription = productDescription;
    }
}