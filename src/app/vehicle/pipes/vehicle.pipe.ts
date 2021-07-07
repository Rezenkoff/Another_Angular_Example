import { Pipe, Injectable, PipeTransform } from "@angular/core";
import { UserCar } from '../models/user-car.model';

@Pipe({ name: 'vehicleFilter', pure: false })
@Injectable()
export class VehiclePipe implements PipeTransform {

    transform(items: UserCar[], showDisabled: boolean): UserCar[] {
        if (showDisabled == true)
            return items;
        return items.filter(x => x.isActive == true);
    }
}