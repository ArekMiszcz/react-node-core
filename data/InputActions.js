'use strict';

import {has, isEmpty} from 'lodash';

import EventEmitterClient from "./../clients/eventEmitterClient";

import AppStore from "./AppStore";
import InputActionTypes from "./InputActionTypes";

const Actions = {
    send(input, value) {
        const appState = AppStore.getState();
        const links = appState.links.filter(link =>
            has(link, 'end.pin.id') && has(link, 'begin.pin.id') && link.end.pin.id === input.props.id);

        if (!isEmpty(links)) {
            links.forEach(link => EventEmitterClient.emit(InputActionTypes.SEND, {
                nodeId: link.end.node.id,
                inputId: input.props.id,
                value
            }));
        }
    }
};

export default Actions;