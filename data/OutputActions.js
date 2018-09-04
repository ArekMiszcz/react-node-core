'use strict';

import {has, isEmpty} from 'lodash';

import EventEmitterClient from "./../clients/eventEmitterClient";

import OutputActionTypes from './OutputActionTypes';
import AppStore from "./AppStore";

const Actions = {
    send(output, value) {
        const appState = AppStore.getState();
        const links = appState.links.filter(link =>
            has(link, 'end.pin.id') && has(link, 'begin.pin.id') && link.begin.pin.id === output.props.id);

        if (!isEmpty(links)) {
            links.forEach(link => EventEmitterClient.emit(OutputActionTypes.SEND, {
                inputId: link.end.pin.id,
                value
            }));
        }
    }
};

export default Actions;