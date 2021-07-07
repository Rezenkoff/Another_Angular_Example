import { McBreadcrumbsType } from "./mc-breadcrumbs-type.enum";

export class McBreadcrumbsParamsModel {

    constructor(public isCustomBreadCrumbs: boolean) { }

    public filter1: string;
    public filter2: string;
    public urlEnding: string;
    public breadCrumbsType: McBreadcrumbsType;
}