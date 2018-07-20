'use strict';

import {has, isEmpty} from 'lodash';

import AppStore from "./AppStore";
import InputActionTypes from "./InputActionTypes";

const Actions = {
    send(input, value) {
        const appState = AppStore.getState();
        const eventEmitter = appState.eventEmitter;
        const links = appState.links.filter(link =>
            has(link, 'end.pin.id') && has(link, 'begin.pin.id') && link.end.pin.id === input.props.id);

        if (!isEmpty(links)) {
            links.forEach(link => eventEmitter.emit(InputActionTypes.SEND, {
                nodeId: link.end.node.id,
                inputId: input.props.id,
                value
            }));
        }
    }
};

export default Actions;