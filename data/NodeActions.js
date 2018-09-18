'use strict';

import EventEmitterClient from "./../clients/eventEmitterClient";

import NodeActionTypes from './NodeActionTypes';

const Actions = {
  send(node, outputId, value) {
      EventEmitterClient.emit(NodeActionTypes.SEND, {
          outputId,
          value
      });
  }
};

export default Actions;