'use strict';

import {get, has, isEmpty} from 'lodash';

import EventEmitterClient from "./../clients/eventEmitterClient";

import AppStore from "./AppStore";
import InputActionTypes from "./InputActionTypes";

const Actions = {
    send(input, value) {
        const appState = AppStore.getState();
        const links = appState.links.filter(link =>
            get(link, 'end.output.id') === input.props.id || get(link, 'begin.output.id') === input.props.id);

        if (!isEmpty(links)) {
            links.forEach(link => EventEmitterClient.emit(InputActionTypes.SEND, {
                nodeId: link.end.node.id,
                inputId: has(link, 'end.input.id') ? link.end.input.id : link.begin.input.id,
                value
            }));
        }
    }
};

export default Actions;