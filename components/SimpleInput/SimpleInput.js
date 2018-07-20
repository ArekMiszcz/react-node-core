import React from 'react';

import AbstractNode from './../Node/Node';
import Output from './Output';

class SimpleInput extends AbstractNode {
    render() {
        return <g className="node" id={this.uniqueId} x={this.state.x} y={this.state.y}>
            <rect width={this.state.width} height={this.state.height} className="node-body" />

            <Output i={0}
                    id={this.props.outputs[0].id}
                    r={this.OUTPUT_RADIUS}
                    s={this.OUTPUT_SPACE}
                    x={this.state.width - this.BODY_PADDING}

                    node={this} />
        </g>;
    }
}

export default SimpleInput;