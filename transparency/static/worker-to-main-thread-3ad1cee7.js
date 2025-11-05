define(['exports'], (function (exports) { 'use strict';

  // @todo
  // Communication Interface should be refactored to new MessageChannel
  // https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel
  const NO_CONVERSATION_ID = -1;
  let actualConversationId = 0;
  class CommunicationInterface {
      get eventPoster() {
          if (this._eventPoster && this._eventPoster.postMessage) {
              return this._eventPoster;
          }
          if (this.eventListener && this.eventListener.postMessage) {
              return this.eventListener;
          }
          return {
              postMessage: () => undefined,
          };
      }
      hasEventPoster() {
          return !!this._eventPoster;
      }
      constructor(_callbacks, eventListener) {
          this._callbacks = _callbacks;
          this.eventListener = eventListener;
          this.eventListener.addEventListener('message', this, false);
      }
      nextConversationId() {
          return actualConversationId++;
      }
      setEventPoster(eventPoster) {
          this._eventPoster = eventPoster;
      }
      handleEvent(e) {
          if (!e || !e.data) {
              return;
          }
          const [prefixedCommand, conversationId, data] = JSON.parse(e.data);
          if (!prefixedCommand ||
              prefixedCommand.indexOf("rml" /* WORKER_CONSTANTS.PREFIX */) !== 0) {
              return;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_prefix, commandString] = prefixedCommand.split("." /* WORKER_CONSTANTS.SEPERATOR */);
          const command = parseInt(commandString, 10);
          this._callbacks.onCommand(command, parseInt(conversationId, 10), data);
      }
  }

  class WorkerToMainThread extends CommunicationInterface {
      constructor(callback, eventListener) {
          super(callback, eventListener || self); // needed for testing because self can not be mocked!!
      }
      sendToMainThread(command, conversationId, data) {
          const message = JSON.stringify([
              "rml" /* WORKER_CONSTANTS.PREFIX */ + "." /* WORKER_CONSTANTS.SEPERATOR */ + command,
              conversationId,
              data,
          ]);
          if (!this.hasEventPoster() &&
              !!self.ServiceWorkerGlobalScope &&
              this.eventListener instanceof self.ServiceWorkerGlobalScope) {
              // @ts-ignore -- needed because there are problems with https://github.com/DefinitelyTyped/DefinitelyTyped/issues/28342#issuecomment-415689364
              // eslint-disable-next-line
              clients.matchAll({ includeUncontrolled: true }).then((clients) => {
                  // eslint-disable-line
                  clients.forEach((client) => client.postMessage(message));
              }, (error) => console.error(error));
          }
          else {
              this.eventPoster.postMessage(message);
          }
      }
  }

  exports.NO_CONVERSATION_ID = NO_CONVERSATION_ID;
  exports.WorkerToMainThread = WorkerToMainThread;

}));
//# sourceMappingURL=worker-to-main-thread-3ad1cee7.js.map
