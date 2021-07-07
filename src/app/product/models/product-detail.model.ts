import { ApplicabilityItem, OECode, Specification, ResourceInfo} from '.';

export class ProductDetail {
    productId: number;
    productDisplayDescription: string;
    specificationList: Array<Specification>;
    applicabilityList: Array<ApplicabilityItem>;
    resourceList: Array<ResourceInfo>;
    oeCodeList: Array<OECode>;
    hasReviews: boolean

    constructor(productId: number, resourceList: Array<ResourceInfo>, specificationList: Array<Specification>, applicabilityList: Array<ApplicabilityItem>, oeCodeList: Array<OECode>, productDisplayDescription:string, hasReviews: boolean) {
        this.productId = productId;
        this.applicabilityList = applicabilityList;
        this.oeCodeList = oeCodeList;
        this.specificationList = specificationList;
        this.resourceList = resourceList;
        this.productDisplayDescription = productDisplayDescription;
        this.hasReviews = hasReviews;
    }
}

