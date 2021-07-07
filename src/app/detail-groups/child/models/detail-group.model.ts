import { DetailInfoModel } from './detail-info.model'

export class DetailGroupModel {
    code: string;
    filter: string;
    flag: string;
    imageurl: string;
    modelspecification: string;
    name: string;
    note: string;
    ssd: string;
    unitid: number;
    category: string;
    Detail: Array<DetailInfoModel>;
}