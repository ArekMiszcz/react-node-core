import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Node from './Node';
import SimpleInput from './../SimpleInput/SimpleInput';
import SimpleOutput from './../SimpleOutput/SimpleOutput';
import Adder from './../Adder/Adder';

class Container extends Component {
    constructor () {
        super();

        this.components = {
            node: Node,
            simpleInput: SimpleInput,
            simpleOutput: SimpleOutput,
            adder: Adder
        };
    }

    render () {
        const Component = this.components[this.props.type || 'node'];

        return <Component id={this.props.id}
            x={this.props.x}
            y={this.props.y}

            inputs={this.props.inputs}
            outputs={this.props.outputs} />;
    }
}

Container.propTypes = {
    type: PropTypes.string,

    id: PropTypes.number.isRequired,

    x: PropTypes.number,
    y: PropTypes.number,

    inputs: PropTypes.array.isRequired,
    outputs: PropTypes.array.isRequired
};

export default Container;