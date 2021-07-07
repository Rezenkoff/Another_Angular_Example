import { IBreadcrumb } from '../../breadcrumbs/mc-breadcrumbs.shared';

export class Node {
    nodeId: number;
    parentId: number;
    hasChildren: boolean;
    artQuantity: number;
    imageUrl: string;
    pageURL: string;
    name: string;
    deepLevel: number;
    children: Node[];
    breadcrumbs: IBreadcrumb[];
    show: boolean;//for mobile view

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    public getNodeId(node: Node): number {     

        if (node && this.deepLevel == 3)
            return this.nodeId

        if (node && this.deepLevel == 4)
            return this.parentId

        return this.nodeId;
    }
    public getNodeDependsOnLevel(): Node {
        return this.deepLevel == 3 || this.deepLevel == 4 ? this : null;
    }
}
