import React, {Component} from 'react';
import {select} from 'd3-selection';
import PropTypes from 'prop-types';
import {get} from 'lodash/object';

import AppStore from './../../data/AppStore';
import LinkActions from "../../data/LinkActions";
import InputActions from "../../data/InputActions";
import OutputActionTypes from "../../data/OutputActionTypes";

import './Input.less';

class Input extends Component {
    constructor() {
        super();

        this.eventEmitter = AppStore.getState().eventEmitter;
    }

    componentWillMount() {
        this.uniqueId = `input_${this.props.id}`;
    }

    render () {
        const y = this.props.r + this.props.s + ((this.props.r * 2 * (!this.props.i ? 0 : 1) + this.props.s) * this.props.i);

        return <circle id={this.uniqueId}
            cx={this.props.x}
            cy={y}
            r={this.props.r}
            className="node-input" />;
    }

    componentDidMount() {
        this.eventEmitter.addListener(OutputActionTypes.SEND, data => {
            if (this.props.id === get(data, 'inputId')) {
                InputActions.send(this, data.value);
            }
        });

        const d3Element = select(`#${this.uniqueId}`);

        d3Element.on('mouseover', () => {
            d3Element.style('stroke-width', 3);
        }).on('mouseleave', () => {
            d3Element.style('stroke-width', 1);
        }).on('click', () => LinkActions.addLinkToInput(this));
    }
}

Input.propTypes = {
    id: PropTypes.number.isRequired,

    i: PropTypes.number.isRequired,
    r: PropTypes.number.isRequired,
    s: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,

    node: PropTypes.object.isRequired
};

export default Input;