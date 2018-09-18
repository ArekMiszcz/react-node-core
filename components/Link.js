import React, {Component} from 'react';
import {select, event, mouse} from 'd3-selection';
import PropTypes from 'prop-types';
import {isEmpty} from 'lodash/lang';
import {has, get} from 'lodash/object';

import EventEmitterClient from "./../clients/eventEmitterClient";

import AppStore from "../data/AppStore";
import Node from './Node/Node';
import NodeActionTypes from "../data/NodeActionTypes";
import LinkActionTypes from "../data/LinkActionTypes";
import ContextMenu from './Commons/ContextMenu';
import LinkActions from '../data/LinkActions';

class Link extends Component {
    MOUNTED_FLAG = 1;
    CURVE_INCLINATION = 50;

    constructor () {
        super();

        this.state = {
            isNew: true,
            begin: {
                position: {
                    x: 0,
                    y: 0
                }
            },
            end: {
                position: {
                    x: 0,
                    y: 0
                }
            }
        };
    }

    static getUniqueId() {
        const links = AppStore.getState().links;

        return Math.max(...links.map(link => link.id)) + 1;
    }

    render () {
        const uniqueId = `link_${this.props.id}`;

        const d = `M${this.state.begin.position.x} ${this.state.begin.position.y} 
        C ${this.state.begin.position.x + this.CURVE_INCLINATION} ${this.state.begin.position.y + this.CURVE_INCLINATION}, 
        ${this.state.end.position.x - this.CURVE_INCLINATION} ${this.state.end.position.y - this.CURVE_INCLINATION}, 
        ${this.state.end.position.x} ${this.state.end.position.y}`;

        return <path id={uniqueId} d={d} stroke="black" strokeWidth="2" fill="transparent"/>;
    }

    componentDidMount() {
        const uniqueId = `#link_${this.props.id}`;
        
        EventEmitterClient.on(NodeActionTypes.UPDATE, data => {
            if (this.MOUNTED_FLAG) {
                this.onElementUpdate(data);
            }
        });

        let newState = {};

        if (!isEmpty(this.props.begin)) {
            const beginD3Node = select(`#node_${this.props.begin.node.id}`);
            const beginD3Pin = select(`#output_${this.props.begin.output.id}`);

            newState = {
                begin: {
                    d3Node: beginD3Node,
                    d3Pin: beginD3Pin,
                    position: {
                        x: this.props.begin.node.position.x + Number(beginD3Pin.attr('cx')) + 5,
                        y: this.props.begin.node.position.y + Number(beginD3Pin.attr('cy'))
                    }
                }
            };
        }

        if (!isEmpty(this.props.end)) {
            const endD3Node = select(`#node_${this.props.end.node.id}`);
            const endD3Pin = select(`#input_${this.props.end.input.id}`);

            newState = {
                ...newState,
                end: {
                    d3Node: endD3Node,
                    d3Pin: endD3Pin,
                    position: {
                        x: this.props.end.node.position.x + Number(endD3Pin.attr('cx')) - 5,
                        y: this.props.end.node.position.y + Number(endD3Pin.attr('cy'))
                    }
                }
            };
        }

        if (isEmpty(this.props.begin)) {
            document.onmousemove = (e) => { // eslint-disable-line
                if (!has(this.state, 'begin.d3Node') && this.MOUNTED_FLAG === 1) {
                    newState = {
                        ...newState,
                        begin: {
                            position: {
                                x: e.x + 5,
                                y: e.y + 5
                            }
                        }
                    };
    
                    this.setState(newState);
                }
            };
        } else if (isEmpty(this.props.end)) {
            document.onmousemove = (e) => { // eslint-disable-line
                if (!has(this.state, 'end.d3Node') && this.MOUNTED_FLAG === 1) {
                    newState = {
                        ...newState,
                        end: {
                            position: {
                                x: e.x + 5,
                                y: e.y + 5
                            }
                        }
                    };

                    this.setState(newState);
                }
            };
        } else {
            newState.isNew = false;

            this.setState(newState);
        };

        const contextMenu = new ContextMenu([
            {
                text: 'Delete',
                onClick: () => LinkActions.removeLink(this.props.id)
            }
        ]);

        select(uniqueId).on('mouseover', function () {
            select(this)
                .style("stroke-width", "4px")
                .style("cursor", "pointer");
        }).on('mouseleave', function () {
            select(this).style("stroke-width", "2px");
        }).on('contextmenu', function () {
            event.preventDefault();

            const xy = mouse(this);

            contextMenu.menu(xy[0], xy[1]);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (get(this.state, 'isNew') === true && has(nextProps, 'begin.node.id') && has(nextProps, 'end.node.id')) {
            this.makeLink(nextProps);
        }
    }

    onElementUpdate(data) {
        if (get(data, 'instance') instanceof Node) {
            this.updatePosition(data);
        }
    }

    makeLink(props) {
        const beginD3Node = select(`#node_${props.begin.node.id}`);
        const beginD3Pin = select(`#output_${props.begin.output.id}`);
        const endD3Node = select(`#node_${props.end.node.id}`);
        const endD3Pin = select(`#input_${props.end.input.id}`);

        this.setState({
            isNew: false,
            begin: {
                d3Node: beginD3Node,
                d3Pin: beginD3Pin,
                position: {
                    x: props.begin.node.position.x + Number(beginD3Pin.attr('cx')) + 5,
                    y: props.begin.node.position.y + Number(beginD3Pin.attr('cy'))
                }
            },
            end: {
                d3Node: endD3Node,
                d3Pin: endD3Pin,
                position: {
                    x: props.end.node.position.x + Number(endD3Pin.attr('cx')) - 5,
                    y: props.end.node.position.y + Number(endD3Pin.attr('cy'))
                }
            }
        });

        EventEmitterClient.emit(NodeActionTypes.UPDATE);
    }

    updatePosition(data) {
        if (has(this.props, 'begin.node.id') && data.instance.props.id === this.props.begin.node.id) {
            this.setState(Object.assign(this.state.begin, {
                position: {
                    x: data.params.x + Number(this.state.begin.d3Pin.attr('cx')) + 5,
                    y: data.params.y + Number(this.state.begin.d3Pin.attr('cy'))
                }
            }));
        }

        if (has(this.props, 'end.node.id') && data.instance.props.id === this.props.end.node.id) {
            this.setState(Object.assign(this.state.end, {
                position: {
                    x: data.params.x + Number(this.state.end.d3Pin.attr('cx')) - 5,
                    y: data.params.y + Number(this.state.end.d3Pin.attr('cy'))
                }
            }));
        }
    }

    componentWillUnmount() {
        this.MOUNTED_FLAG = 0;
    }
}

Link.propTypes = {
    id: PropTypes.number,
    begin: PropTypes.object,
    end: PropTypes.object
};

export default Link;