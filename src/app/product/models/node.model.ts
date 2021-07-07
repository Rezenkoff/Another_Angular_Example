export class Node {
    public name: string;
    public children: Node[]
    public id: number;
    public hasChildren: boolean;

    constructor(name: string, children: Node[], hasChildren?: boolean, id?: number) {
        this.name = name;
        this.children = children;
        this.id = id;
        this.hasChildren = hasChildren;
    }
}