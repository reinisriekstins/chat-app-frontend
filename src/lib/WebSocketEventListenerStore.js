/**
 * I chose to implement my own store of event listeners because
 * this store is agnostic the WebSocket instance being used,
 * so there no need to assign new event listeners upon a connection closing
 * and a new WebSocket connection being created.
 */

const wsEvtListenerStore = {};
export default {
  on(evtType, listener) {
    if (typeof listener !== 'function') {
      throw new Error('Event listener is not a function');
    }
    if (wsEvtListenerStore[evtType]) {
      if (wsEvtListenerStore[evtType].find(func => func === listener)) {
        console.warn('Trying to add a function as an event listener moer than once');
        return;
      }

      wsEvtListenerStore[evtType].push(listener);
    } else {
      wsEvtListenerStore[evtType] = [listener];
    }
  },
  off(evtType, listener) {
    if (typeof listener !== 'function') {
      throw new Error('Event listener is not a function');
    }

    const indexOfListener = wsEvtListenerStore[evtType]?.indexOf(listener);
    if (indexOfListener === -1 || typeof indexOfListener !== 'number') {
      console.warn(`The event listener you're trying to remove was not found for event type ${evtType}`);
      return;
    }

    wsEvtListenerStore[evtType].splice(indexOfListener, 1);
  },
  emit(evtType, ...args) {
    if (wsEvtListenerStore[evtType]) {
      wsEvtListenerStore[evtType].forEach(listener => listener(...args));
    }
  },
};