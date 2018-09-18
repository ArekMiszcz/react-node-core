'use strict';

import {has, get, isEmpty} from 'lodash';

import EventEmitterClient from "./../clients/eventEmitterClient";

import OutputActionTypes from './OutputActionTypes';
import AppStore from "./AppStore";

const Actions = {
    send(output, value) {
        const appState = AppStore.getState();
        const links = appState.links.filter(link =>
            get(link, 'end.output.id') === output.props.id || get(link, 'begin.output.id') === output.props.id);

        if (!isEmpty(links)) {
            links.forEach(link => EventEmitterClient.emit(OutputActionTypes.SEND, {
                inputId: has(link, 'end.output.id') ? link.end.output.id : link.begin.output.id,
                value
            }));
        }
    }
};

export default Actions;