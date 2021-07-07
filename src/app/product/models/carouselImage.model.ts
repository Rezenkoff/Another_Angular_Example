export class CarouselImage {
    big: string;
    medium: string;
    small: string;
    description: string;
    alt: string;
    title: string;

    constructor(big?: string, medium?: string, small?: string, description?: string) {
        this.big = big || "";
        this.medium = medium || "";
        this.small = small || "";
        this.description = description || "";
    }
}