import { UserCar } from '../models/user-car.model';
import * as vehicle from '../actions/vehicle.actions';

export interface State {
    usersVehicles: UserCar[],
    editVehicleId: number
}

const initialState: State = {
    usersVehicles: [],
    editVehicleId: 0
};

export function reducer(state = initialState, action: vehicle.Actions): State {

    switch (action.type) {

        case vehicle.ADD_VEHICLE: {
            return {
                ...state,
                usersVehicles: [...state.usersVehicles, { ...action.payload }]
            };
        }

        case vehicle.ADD_VEHICLE_SUCCESS: {
            let vehicle = state.usersVehicles.find(v => (!v.id));
            if (vehicle) {
                vehicle.id = action.payload;
            }
            return { ...state }
        }

        case vehicle.ADD_VEHICLE_FAIL: {
            return {
                ...state,
                usersVehicles: state.usersVehicles.filter(vh => vh.id != action.payload.id)
            }
        }

        case vehicle.EDIT_VEHICLE: {
            return state;
        }
        case vehicle.EDIT_VEHICLE_SUCCESS: {
            if (!action.payload.success) throw new Error("trouble on server side");
            let index = state.usersVehicles.map(review => review.id).indexOf(action.payload.data.id);
            return {
                ...state,
                usersVehicles: [
                    ...state.usersVehicles.slice(0, index),
                    Object.assign({}, state.usersVehicles[index], action.payload.data),
                    ...state.usersVehicles.slice(index + 1)
                ]
            }
        }
        case vehicle.EDIT_VEHICLE_FAIL: {
            return state;
        }

        case vehicle.CHANGE_ISACTIVE_SUCCESS: {
            let vehicle = state.usersVehicles.find(v => v.id == action.payload.id);
            if (vehicle) {
                vehicle.isActive = (action.payload.isActive);
            } 
            return { ...state };
        }

        case vehicle.GET_VEHICLE: {
            return state;
        }

        case vehicle.GET_VEHICLE_SUCCESS: {
            return {
                ...state,
                usersVehicles: action.payload
            }
        }

        case vehicle.SET_VEHICLE_ID_FOR_EDIT: {
            return {
                ...state,
                editVehicleId: action.payload
            }
        }

        default: {
            return state;
        }
    }
}

export const getUserVehicles = (state: State) => state.usersVehicles;
export const getActiveUserVehicles = (state: State) => state.usersVehicles.filter(uv => uv.isActive);
export const getVehiclesForFilter = (state: State) => state.usersVehicles.filter(uv => uv.markId != 0 && uv.modelId != 0 && uv.isActive == true);
export const getVehicleForEdit = (state: State) => state.usersVehicles.find(uv => uv.id == state.editVehicleId);
export const getActiveUserVehiclesCount = (state: State) => state.usersVehicles.filter(uv => uv.isActive).length;

