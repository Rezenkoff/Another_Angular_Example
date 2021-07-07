import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseLogRecordModel } from '../models/baseLogRecord.model'
import { environment } from '../../../environments/environment';

@Injectable()
export class LoggerService {
    constructor(private _http: HttpClient) {
    }

    public logRecord(record: BaseLogRecordModel) {
        if (!record) {
            return;
        }
        let logRequest = { data: JSON.stringify(record), type: record.type };
        this._http.post(environment.apiUrl + 'logger/create', JSON.stringify(logRequest), ).subscribe();   
    }
}