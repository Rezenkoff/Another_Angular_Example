import { Injectable } from '@angular/core';

@Injectable()
export class SortService {

    public orderByProperty(propName: string, array: Array<any>, sortingOrder: string = "DESC") {

        let isDateTime = false;

        if (!propName || !array || array.length < 2) {
            return;
        }

        //check if is dateTime
        let val = this.getValueByPropName(array[0], propName);
        if (typeof val === 'string' && this.isDateTime(val)) {
           array.sort(
               (a: any, b: any) => {
                   let val1 = this.convertToDateTime(this.getValueByPropName(a, propName));
                   let val2 = this.convertToDateTime(this.getValueByPropName(b, propName));
                    return this.compare(val1, val2, sortingOrder);
                }
            );
        }
        else {
            array.sort(
                (a: any, b: any) => {
                    let val1 = this.getValueByPropName(a, propName);
                    let val2 = this.getValueByPropName(b, propName);
                    return this.compare(val1, val2, sortingOrder);
                }
            );
        }
    }

    private isDateTime(value: string) {
        //format: "22.05.2013 11:23:22" 
        let matches = value.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{1,2}):(\d{2}):(\d{2})$/);

        return matches;
    }

    private convertToDateTime(value) {
        var date = null;

        let matches = value.match(/^(\d{2})\.(\d{2})\.(\d{4}) (\d{1,2}):(\d{2}):(\d{2})$/);

        if (matches !== null) {
            var year = parseInt(matches[3], 10);
            var month = parseInt(matches[2], 10) - 1; // months are 0-11
            var day = parseInt(matches[1], 10);
            var hour = parseInt(matches[4], 10);
            var minute = parseInt(matches[5], 10);
            var second = parseInt(matches[6], 10);

            date = new Date(year, month, day, hour, minute, second);
        }

        return date;
    }

    private compare(val1: any, val2: any, sortingType: string = "DESC") {

        if (val1 < val2) {
            return (sortingType === "ASC") ? -1 : 1;
        } else if (val1 > val2) {
            return (sortingType === "ASC") ? 1 : -1;
        } else {
            return 0;
        }
    }

    private getValueByPropName(obj: any, propName: string) {
        if (!obj || !propName) {
            return;
        }
        //to support subobjects in objects, like 'object1.object2.propety'
        if (!propName.includes(".")) {
            return obj[propName];
        }

        let pointIndex = propName.indexOf(".");
        let firstProp = propName.substring(0, pointIndex);
        let secondProp = propName.substring(pointIndex + 1, propName.length);
                
        return obj[firstProp][secondProp];
    }
}