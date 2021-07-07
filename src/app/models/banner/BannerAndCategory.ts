import { BannerModel } from "./banner.model";

export class BannerAndCategory extends BannerModel {
    public parentId: number;
    public categries: BannerModel[];
    public svgImage: string;
}