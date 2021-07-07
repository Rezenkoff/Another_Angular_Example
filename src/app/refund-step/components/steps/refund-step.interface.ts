import { EventEmitter } from '@angular/core';

export interface IRefundStep {
    isValid: boolean;
    change: EventEmitter<boolean>;
}