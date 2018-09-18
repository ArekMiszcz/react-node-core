import React, {Component} from 'react';
import {select} from 'd3-selection';
import PropTypes from 'prop-types';
import {get,has} from 'lodash/object';

import EventEmitterClient from "./../../clients/eventEmitterClient";

import NodeActionTypes from './../../data/NodeActionTypes';

import OutputActions from './../../data/OutputActions';
import LinkActions from "../../data/LinkActions";

import './Output.less';

class Output extends Component {
    constructor() {
        super();
    }

    componentWillMount() {
        this.uniqueId = `output_${this.props.id}`;
    }

    render () {
        const y = this.props.r + this.props.s + ((this.props.r * 2 * (!this.props.i ? 0 : 1) + this.props.s) * this.props.i);

        return <circle id={this.uniqueId}
            cx={this.props.x}
            cy={y}
            r={this.props.r}
            className="node-output" />;
    }

    componentDidMount() {
        EventEmitterClient.on(NodeActionTypes.SEND, data => {
            if (this.props.id === get(data, 'outputId')) {
                this.setState({
                    ...this.state,
                    value: data.value
                });

                OutputActions.send(this, data.value);
            }
        });

        EventEmitterClient.on(NodeActionTypes.UPDATE, () => {
            if (has(this, 'state.value')) {
                OutputActions.send(this, this.state.value);
            }
        });

        const d3Element = select(`#${this.uniqueId}`);

        d3Element.on('mouseover', () => {
            d3Element.style('stroke-width', 3);
        }).on('mouseleave', () => {
            d3Element.style('stroke-width', 1);
        }).on('click', () => LinkActions.addLinkToOutput(this));
    }

    sendData(value) {
        this.setState({
            ...this.state,
            value
        });

        OutputActions.send(this, value);
    }
}

Output.propTypes = {
    id: PropTypes.number.isRequired,

    i: PropTypes.number.isRequired,
    r: PropTypes.number.isRequired,
    s: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,

    node: PropTypes.object.isRequired
};

export default Output;