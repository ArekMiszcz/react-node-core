'use strict';

import NodeActionTypes from './NodeActionTypes';
import AppStore from "./AppStore";

const Actions = {
  send(node, outputId, value) {
      const eventEmitter = AppStore.getState().eventEmitter;

      eventEmitter.emit(NodeActionTypes.SEND, {
          outputId,
          value
      });
  }
};

export default Actions;