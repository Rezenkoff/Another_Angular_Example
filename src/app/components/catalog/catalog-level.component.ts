import { Component, Input, Inject } from '@angular/core';
import { Node } from '../../catalog/models/node.model';
import { MatDialogRef } from '@angular/material/dialog';
import { CatalogPopupComponent } from '../../components/catalog/catalog-popup.component';
import { CatalogType } from '../../catalog/models/catalog-type.enum';

@Component({
    selector: 'catalog-level',
    templateUrl: './__mobile__/catalog-level.component.html'
})

export class CatalogLevelComponent {

    @Input() children: any;
    @Input() catalogType: CatalogType;
    isMobile: boolean;

    constructor(
        private dialogRef: MatDialogRef<CatalogPopupComponent>
        ) {
    }

    public closeModal(): void {
        this.dialogRef.close();
    }

    public getNodeId(node: Node): string {
        return node.nodeId.toString();
    }

    public showMobileBlock(node: Node): void {
        node.show = !node.show;
        let element = document.getElementById(node.nodeId.toString());

        if (!element)
            return;
        if (element.style.display == "none" || element.style.display == "")
            element.style.display = "block";
        else
            element.style.display = "none";
    }

    public getQueryParams(): Object {
        if (this.catalogType == CatalogType.Full) {
            return null;
        }
        return { formFactor: this.catalogType };
    }
}
