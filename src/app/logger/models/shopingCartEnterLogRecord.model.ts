import { BaseLogRecordModel } from './baseLogRecord.model';
import { LogEntryType } from './logEntryType.enum';

export class ShopingCartEnterRecordModel extends BaseLogRecordModel {

    constructor( ) {
        super(LogEntryType.ShopingCartPageEnter);
    }
}