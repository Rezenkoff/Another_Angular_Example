import { ModelModification, modelModificationFields, NameValueModel } from '../../models';

export class InfoTypeHelper {

    public static GetTypeInfoJson(model: ModelModification): string {
        let techInfo: Array<NameValueModel> = new Array<NameValueModel>();
        techInfo.push(new NameValueModel(modelModificationFields.id, model.id.toString()));
        techInfo.push(new NameValueModel(modelModificationFields.name, model.name));
        techInfo.push(new NameValueModel(modelModificationFields.years, model.years));
        techInfo.push(new NameValueModel(modelModificationFields.powerHp, model.power_hp.toString()));
        techInfo.push(new NameValueModel(modelModificationFields.powerKh, model.power_kw.toString()));
        techInfo.push(new NameValueModel(modelModificationFields.engineCap, model.engine_cap.toString()));
        techInfo.push(new NameValueModel(modelModificationFields.bodytype, model.bodytype));
        techInfo.push(new NameValueModel(modelModificationFields.cylinders, model.cylinders));
        techInfo.push(new NameValueModel(modelModificationFields.driveType, model.driveType));
        techInfo.push(new NameValueModel(modelModificationFields.values, model.values.toString()));
        techInfo.push(new NameValueModel(modelModificationFields.fuel, model.fuel));
        techInfo.push(new NameValueModel(modelModificationFields.engineType, model.engineType));
        techInfo.push(new NameValueModel(modelModificationFields.refueling, model.refueling));
        return JSON.stringify(techInfo);
    }
}