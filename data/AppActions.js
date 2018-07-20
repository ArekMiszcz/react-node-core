'use strict';

import AppActionsTypes from './AppActionTypes';
import AppDispatcher from './AppDispatcher';

const Actions = {
    initialize(data) {
        AppDispatcher.dispatch({
            type: AppActionsTypes.INITIALIZE,
            data
        });
    },
    refresh() {
        AppDispatcher.dispatch({});
    }
};

export default Actions;