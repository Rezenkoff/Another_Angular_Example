export class CheckoutItem {
    public ArtId: number;
    public Price: number;
    public Quantity: number;
    public Description: string;
    public DescriptionUkr: string;
    public DescriptionRus: string;
    public Brand: string;
    public Category: string;
    public ProductLine: string;
    public LookupNumber: string;
    public Ref_Key: string;
    public Weight: number;
    public IsExpected?: number;
    public supplierRef_Key: string;
    public supplierProductRef_Key: string;
    public isNeedToInstall: boolean;
    public isTire: boolean;

    constructor(
        id: number,
        price: number,
        quantity: number,
        description?: string,
        descriptionUkr?: string,
        descriptionRus?: string,
        brand?: string,
        category?: string,
        productLine?: string,
        lookupNumber?: string,
        ref_Key?: string,
        weight?: number,
        isExpected?: number,
        supplierProductRef_Key?: string,
        isNeedToInstall?: boolean,
        isTire?: boolean,
        supplierRef_Key?: string
    ) {
        this.ArtId = id;
        this.Price = price;
        this.Quantity = quantity;
        this.Description = description || '';
        this.DescriptionUkr = descriptionUkr || '';
        this.DescriptionRus = descriptionRus || '';
        this.Brand = brand || '';
        this.Category = category || '';
        this.ProductLine = productLine;
        this.LookupNumber = lookupNumber;
        this.Ref_Key = ref_Key;
        this.Weight = weight;
        this.IsExpected = isExpected;
        this.supplierProductRef_Key = supplierProductRef_Key;
        this.isNeedToInstall = isNeedToInstall;
        this.isTire = isTire;
        this.supplierRef_Key = supplierRef_Key;
    }
}
