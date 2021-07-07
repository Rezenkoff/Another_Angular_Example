import { ActionReducerMap, ActionReducer } from '@ngrx/store';
import { environment } from '../../../environments/environment';

export interface State { 
  
}

export const reducers: ActionReducerMap<State> = {
  
};

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function(state: State, action: any): State {

    if(!environment.production){
      console.log('state', state);
      console.log('action', action);
    }

    return reducer(state, action);
  };
}