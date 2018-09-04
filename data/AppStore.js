import {ReduceStore} from 'flux/utils';

import AppDispatcher from './AppDispatcher';
import AppActionsTypes from './AppActionTypes';
import InputActionTypes from './InputActionTypes';
import OutputActionTypes from './OutputActionTypes';


class AppStore extends ReduceStore {
    constructor() {
      super(AppDispatcher);
    }

    getInitialState() {
        return {
            nodes: [],
            links: []
        };
    }

    reduce(state, action) {
        switch(action.type) {
            case AppActionsTypes.INITIALIZE:
                return {
                    ...state,
                    ...action.data
                };
            case InputActionTypes.SELECT:
                return {
                    ...state,
                    links: action.links
                };
            case OutputActionTypes.SELECT:
                return {
                    ...state,
                    links: action.links
                };
            default:
                return state;
        }
    }
}

export default new AppStore();