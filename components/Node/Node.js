import React, {Component} from 'react';
import {select, event} from 'd3-selection';
import {drag} from 'd3-drag';
import PropTypes from 'prop-types';
import {get, has} from 'lodash/object';
import {head} from 'lodash/array';
import {isEmpty} from 'lodash/lang';

import Input from './Input';
import Output from './Output';

import './Node.less';

import EventEmitterClient from "./../../clients/eventEmitterClient";

import AppStore from "./../../data/AppStore";
import InputActionTypes from './../../data/InputActionTypes';
import NodeActionTypes from './../../data/NodeActionTypes';
import NodeActions from "../../data/NodeActions";
import LinkActionTypes from '../../data/LinkActionTypes';

class Node extends Component {
    BODY_PADDING = 15;

    INPUT_RADIUS = 5;
    INPUT_SPACE = 10;

    OUTPUT_RADIUS = 5;
    OUTPUT_SPACE = 10;

    constructor () {
        super();

        this.state = {
            x: 0,
            y: 0,
            width: 300,
            height: 0,
            value: {}
        };
    }

    componentWillMount() {
        this.uniqueId = `node_${this.props.id}`;

        

        EventEmitterClient.on(InputActionTypes.SEND, data => {
            if (this.props.id === get(data, 'nodeId')) {
                const state = {
                    ...this.state,
                    value: {
                        ...this.state.value,
                        [data.inputId]: data.value
                    }
                };

                this.setState(state);
                this.onDataReceived(state.value);
            }
        });

        EventEmitterClient.on(LinkActionTypes.DELETE, data => {
            const linkId = data.linkId;
            const link = head(AppStore.getState().links.filter(link => link.id === linkId));

            if (!isEmpty(link)) {
                let inputId;

                if (has(link, 'begin.input.id') && link.begin.node.id === this.props.id) {
                    inputId = link.begin.input.id;
                }

                if (has(link, 'end.input.id') && link.end.node.id === this.props.id) {
                    inputId = link.end.input.id;
                }

                if (this.props.inputs.find(input => input.id === inputId)) {
                    const state = this.state;

                    delete state.value[inputId];
    
                    this.setState(state);
                    this.onDataReceived(state.value);
                }
            }
        });
    }

    render () {
        return <g className="node" id={this.uniqueId} x={this.state.x} y={this.state.y}>
            <rect width={this.state.width} height={this.state.height} className="node-body" />

            {
                this.props.inputs.map((input, key) =>
                    <Input key={key}
                        i={key}
                        id={input.id}

                        r={this.INPUT_RADIUS}
                        s={this.INPUT_SPACE}
                        x={this.BODY_PADDING}

                        node={this} />)
            }

            {
                this.props.outputs.map((output, key) =>
                    <Output key={key}
                        i={key}
                        id={output.id}

                        r={this.OUTPUT_RADIUS}
                        s={this.OUTPUT_SPACE}
                        x={this.state.width - this.BODY_PADDING}

                        node={this} />)
            }
        </g>;
    }

    componentDidMount() {
        const heightByInputs = (this.INPUT_RADIUS * 2 * this.props.inputs.length) +
            (this.props.inputs.length * this.INPUT_SPACE) +
            this.INPUT_SPACE;

        const heightByOutputs = (this.OUTPUT_RADIUS * 2 * this.props.outputs.length) +
            (this.props.outputs.length * this.OUTPUT_SPACE) +
            this.OUTPUT_SPACE;

        this.setState({
            x: this.props.x || this.state.x,
            y: this.props.y || this.state.y,
            width: this.props.width || this.state.width,
            height: this.props.height || heightByInputs > heightByOutputs ? heightByInputs : heightByOutputs
        });

        this.d3element = select(`#${this.uniqueId}`);
        this.d3element.call(drag()
            .on('start', () => this.setState({
                _dx: event.x - this.state.x,
                _dy: event.y - this.state.y
            }))
            .on('drag', () => {
                const x = event.x - this.state._dx;
                const y = event.y - this.state._dy;

                this.setState({ x, y });

                EventEmitterClient.emit(NodeActionTypes.UPDATE, {
                    instance: this,
                    params: {
                        x, y
                    }
                });
            })
            .on('end', () => {}));
    }

    componentDidUpdate() {
        this.d3element.attr('transform', `translate(${this.state.x}, ${this.state.y})`);
    }

    onDataReceived() {}
    sendData(outputId, data) {
        NodeActions.send(this, outputId, data);
    }
}

Node.propTypes = {
    id: PropTypes.number.isRequired,

    width: PropTypes.number,
    height: PropTypes.number,

    x: PropTypes.number,
    y: PropTypes.number,

    inputs: PropTypes.array.isRequired,
    outputs: PropTypes.array.isRequired
};

export default Node;