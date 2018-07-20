import 'react';

import AbstractNode from './../Node/Node';

class Adder extends AbstractNode { 
    onDataReceived(inputs) {
        let result = 0;

        Object.keys(inputs).forEach(inputId =>
            result += Number(inputs[inputId]));

        this.props.outputs.forEach(output =>
            this.sendData(output.id, result));
    }
}

export default Adder;