export class TreeNode {
    id: number;
    name: string;   
    link?: boolean;
    children?: Array<TreeNode>;
    parent?: TreeNode;
    

    constructor(id: number, name: string, link?: boolean, children?: Array<TreeNode>, parent?: TreeNode) {
        this.id = id;
        this.name = name;
        this.children = children;
        this.parent = parent;
        this.link = link || false;
    }
}