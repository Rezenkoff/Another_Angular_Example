export class Part {
    BrandCodeName: string;
    Quantity: number = 1;
    isValid = (): boolean => {
        return this.BrandCodeName != null && this.BrandCodeName != "" && this.Quantity >= 1;
    };
    incrementQunt = (): void => {
        this.Quantity++;
    };
    decrementQunt = (): void => {
        if (this.Quantity > 1)
            this.Quantity--;
    }
}