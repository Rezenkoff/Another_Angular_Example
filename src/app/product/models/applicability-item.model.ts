export class ApplicabilityItem {
    id: string;
    name: string;
    children: Array<ApplicabilityItem>
    constructor(id: string, name: string, item: Array<ApplicabilityItem>) {
        this.id = id;
        this.name = name;
        this.children = item;
    }
}