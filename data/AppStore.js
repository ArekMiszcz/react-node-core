import {ReduceStore} from 'flux/utils';

import AppDispatcher from './AppDispatcher';
import AppActionsTypes from './AppActionTypes';
import LinkActionTypes from './LinkActionTypes';
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
            case LinkActionTypes.DELETE:
                const links = state.links.filter(link => link.id !== action.id);

                return {
                    ...state,
                    links
                };
            case LinkActionTypes.CREATE:
                state.links.push(action.link);
            default:
                return state;
        }
    }
}

export default new AppStore();