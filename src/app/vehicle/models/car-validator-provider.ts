import { UserCar } from './user-car.model';

export function isValidUserCar(car: UserCar): boolean {
    return Boolean(
        car.vin ||
        (car.modifKVP && car.modifKVP.key) ||
        (car.modelKVP && car.modelKVP.key) ||
        (car.serieKVP && car.serieKVP.key));
}

export function isAlreadyAdded(selectedCar: UserCar, userVehicles: UserCar[]): boolean {
    let existingCar: UserCar = null;
    if (selectedCar.vin) {
        existingCar = userVehicles.find(x => x.vin && x.vin == selectedCar.vin)
    } else if (selectedCar.modifKVP && selectedCar.modifKVP.key) {
        existingCar = userVehicles.find(x => x.modifKVP && x.modifKVP.key == selectedCar.modifKVP.key)
    } else if (selectedCar.modelKVP && selectedCar.modelKVP.key) {
        existingCar = userVehicles.find(x => x.modelKVP && x.modelKVP.key == selectedCar.modelKVP.key)
    } else if (selectedCar.serieKVP && selectedCar.serieKVP.key) {
        existingCar = userVehicles.find(x => x.serieKVP && x.serieKVP.key == selectedCar.serieKVP.key)
    }
    return (existingCar != null);
}