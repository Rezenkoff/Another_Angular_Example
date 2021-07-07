import { LogEntryType } from './logEntryType.enum';

export class BaseLogRecordModel {
    public dateTime: Date;
    public type: LogEntryType;
    public message?: string;

    constructor(logEntryType: LogEntryType) {
        this.dateTime = new Date();
        this.type = logEntryType;
    }
}