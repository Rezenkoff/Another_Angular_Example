import { BaseLogRecordModel } from './baseLogRecord.model';
import { LogEntryType } from './logEntryType.enum';

export class FindDetailEnterRecordModel extends BaseLogRecordModel {
    constructor() {
        super(LogEntryType.FindDetailPageEnter);
    }
}