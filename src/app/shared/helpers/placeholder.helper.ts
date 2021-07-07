import { ElementRef } from '@angular/core';
import { ModelModification, KeyValueModel } from '../../models';

export class PlaceHolderHelper {
    public static GetPlaceHolder(holderEl: ElementRef, outArr: Array<KeyValueModel>): KeyValueModel {
        var placeHolderText = holderEl.nativeElement.innerText;
        var holderObj = new KeyValueModel(0, placeHolderText);

        if (outArr == null)
            return holderObj;

        if (outArr[0] && outArr[0].value !== holderObj.value)
            outArr.unshift(holderObj);

        return outArr[0];
    }

    public static GetPlaceHolderString(holderEl: ElementRef, outArr: Array<ModelModification>): ModelModification {
        var placeHolderText = holderEl.nativeElement.innerText;
        var holderObj = new ModelModification(0, '', placeHolderText,0,0,0,'','','',0,'','','');
        if (outArr == null)
            return holderObj;

        if (outArr[0] && outArr[0] !== placeHolderText)
            outArr.unshift(holderObj);

        return outArr[0];
    }

}