import React from 'react';

import AbstractOutput from './../Node/Output';

class Output extends AbstractOutput {
    render () {
        const y = this.props.r + this.props.s + ((this.props.r * 2 * (!this.props.i ? 0 : 1) + this.props.s) * this.props.i);

        return <g>
            <foreignObject height="24" width="245" y="0" x="0">
                <input type="text" onChange={this.changeHandler.bind(this)} />
            </foreignObject>

            <circle id={this.uniqueId}
            cx={this.props.x}
            cy={y}
            r={this.props.r}
            className="node-output" />
        </g>;
    }

    changeHandler(event) {
        this.sendData(event.target.value);
    }
}

export default Output;