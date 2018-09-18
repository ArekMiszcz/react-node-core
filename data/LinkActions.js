'use strict';

import EventEmitterClient from "./../clients/eventEmitterClient";

import LinkActionTypes from './LinkActionTypes';
import InputActionTypes from './InputActionTypes';
import OutputActionTypes from './OutputActionTypes';
import AppDispatcher from './AppDispatcher';
import AppStore from './AppStore';
import {get} from "lodash/object";

const Actions = {
    addLinkToInput: input => {
        const appState = AppStore.getState();
        const links = appState.links;
        const index = links.findIndex(link => !link.end);

        // Should find link without end and this input should be from another node
        if (index !== -1 && get(links[index], 'begin.node.id') !== get(input, 'props.node.props.id')) {
            links[index] = {
                ...links[index],
                end: {
                    node: {
                        id: input.props.node.props.id,
                        position: {
                            x: input.props.node.state.x,
                            y: input.props.node.state.y
                        }
                    },
                    input: {
                        id: input.props.id
                    }
                }
            };

            AppDispatcher.dispatch({
                type: InputActionTypes.SELECT,
                links
            });
            // There is no link without end so create new one
        } else if (links.findIndex(link => !link.id) === -1) {
            links.push({
                id: 0,
                begin: undefined,
                end: {
                    node: {
                        id: input.props.node.props.id,
                        position: {
                            x: input.props.node.state.x,
                            y: input.props.node.state.y
                        }
                    },
                    input: {
                        id: input.props.id
                    }
                }
            });

            AppDispatcher.dispatch({
                type: InputActionTypes.SELECT,
                links
            });
        }
    },
    addLinkToOutput: output => {
        const appState = AppStore.getState();

        const links = appState.links;
        const index = links.findIndex(link => !link.begin);

        // Should find link without begin and this output should be from another node
        if (index !== -1 && get(links[index], 'end.node.id') !== get(output, 'props.node.props.id')) {
            links[index] = {
                ...links[index],
                begin: {
                    node: {
                        id: output.props.node.props.id,
                        position: {
                            x: output.props.node.state.x,
                            y: output.props.node.state.y
                        }
                    },
                    output: {
                        id: output.props.id
                    }
                }
            };

            AppDispatcher.dispatch({
                type: OutputActionTypes.SELECT,
                links
            });
            // There is no link without begin so create new one
        } else if (links.findIndex(link => !link.id) === -1) {
            links.push({
                id: 0,
                begin: {
                    node: {
                        id: output.props.node.props.id,
                        position: {
                            x: output.props.node.state.x,
                            y: output.props.node.state.y
                        }
                    },
                    output: {
                        id: output.props.id
                    }
                },
                end: undefined
            });

            AppDispatcher.dispatch({
                type: OutputActionTypes.SELECT,
                links
            });
        }
    },
    removeLink: id => {
        EventEmitterClient.emit(LinkActionTypes.DELETE, { 
            linkId: id 
        });

        AppDispatcher.dispatch({
            type: LinkActionTypes.DELETE,
            id
        });
    },
    createLink: link => AppDispatcher.dispatch({
        type: LinkActionTypes.CREATE,
        link
    })
};

export default Actions;