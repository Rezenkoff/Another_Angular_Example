import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

@Component({
    selector: 'detail-navigation',
    templateUrl: './__mobile__/detail-navigation.component.html'
})

export class DetailsNavigationComponent {
    @Input() node: TreeNode;
    @Output() onDetailSelect: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();

    onActivate(node: TreeNode) {
        this.onDetailSelect.emit(node);
    }
}