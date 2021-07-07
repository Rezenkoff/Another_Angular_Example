import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'check-availability',
    templateUrl: './__mobile__/check-vailability.component.html'
})

export class CheckAvailability {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { data: any[], availability: any[], language: string },
        private dialogRef: MatDialogRef<CheckAvailability>
    ) { }

    public close(accept: boolean, data: any = null): void {
        this.dialogRef.close({ accept: accept, data: data });
    }

    public getDescription(product: any): string {        
        return (this.data.language == 'UKR') ? product.DescriptionUkr : product.DisplayDescription;
    }
}

class MissingProduct {
    descriptionUkr: string;
    displayDescription: string;
}