import React from 'react';

import AbstractInput from './../Node/Input';

class Input extends AbstractInput {
    render () {
        const y = this.props.r + this.props.s + ((this.props.r * 2 * (!this.props.i ? 0 : 1) + this.props.s) * this.props.i);

        return <g>
            <foreignObject height="24" width="245" y="0" x="28">
                <input type="text" value={this.props.value} disabled />
            </foreignObject>

            <circle id={this.uniqueId}
                cx={this.props.x}
                cy={y}
                r={this.props.r}
                className="node-input" />
        </g>;
    }
}

export default Input;