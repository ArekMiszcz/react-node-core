'use strict';

import {has, isEmpty} from 'lodash';

import OutputActionTypes from './OutputActionTypes';
import AppStore from "./AppStore";

const Actions = {
    send(output, value) {
        const appState = AppStore.getState();
        const eventEmitter = appState.eventEmitter;
        const links = appState.links.filter(link =>
            has(link, 'end.pin.id') && has(link, 'begin.pin.id') && link.begin.pin.id === output.props.id);

        if (!isEmpty(links)) {
            links.forEach(link => eventEmitter.emit(OutputActionTypes.SEND, {
                inputId: link.end.pin.id,
                value
            }));
        }
    }
};

export default Actions;