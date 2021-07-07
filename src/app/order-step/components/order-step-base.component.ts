import { EventEmitter } from '@angular/core';

export interface OrderStepBaseComponent {
    isValid: boolean;
    change: EventEmitter<boolean>;
}