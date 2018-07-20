import React from 'react';
import {head} from 'lodash/array';

import AbstractNode from './../Node/Node';

import Input from './Input';

class SimpleOutput extends AbstractNode {
    render() {
        const inputId = head(this.props.inputs).id;

        return <g className="node" id={this.uniqueId} x={this.state.x} y={this.state.y}>
            <rect width={this.state.width} height={this.state.height} className="node-body" />

            <Input  i={0}
                    id={inputId}

                    r={this.INPUT_RADIUS}
                    s={this.INPUT_SPACE}
                    x={this.BODY_PADDING}

                    value={this.state.value[inputId] || 0}
                    node={this} />
        </g>;
    }
}

export default SimpleOutput;