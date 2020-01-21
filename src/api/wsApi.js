import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

import store from '../store/store';
import { restApi } from './restApi';

const options = { debug: false, heartbeat: false, protocols: ['v12.stomp'] };

export const stompClientSocket = {
  socket: null,
  stompClient: null,

  connect(id, conversations) {
    this.socket = new SockJS('http://localhost:8080/gs-guide-websocket');
    this.stompClient = Stomp.over(this.socket, options);
    return this.stompClient.connect({}, async () => {
      if (conversations) {
        await this.subscribeToChat(id);
        for (const convoId of Object.keys(conversations)) {
          await this.subscribeToTopic(convoId);
          restApi.getMessages(convoId).then(response => {
            store.commit('setMessages', response);
          });
        }
      } else await this.subscribeToChat(id);
    });
  },
  subscribeToTopic(id) {
    return this.stompClient.subscribe('/topic/' + id, async sendMessage => {
      //console.log(JSON.parse(sendMessage.body).body, id);
      if (JSON.parse(sendMessage.body).body&& JSON.parse(sendMessage.body).body.conversationId){

      await store.commit('addMessage', JSON.parse(sendMessage.body).body);
      }
      //console.log('userchat', JSON.parse(sendMessage.body).content, id);
    });
  },
  subscribeToChat(id) {
    this.stompClient.subscribe('/topic/user/' + id, sendMessage => {
      //console.log(JSON.parse(sendMessage.body).content);
      //console.log('mychat', sendMessage.body, id);
    });
  },
  startConversation(message, recipient, sender) {
    this.stompClient.send(
      '/chat/startConversation/' + recipient,
      JSON.stringify({
        message: message,
        recipient: recipient,
        sender: sender,
      })
    );
    this.subscribeToTopic(recipient);
  },
  sendMessage(convoId, message, recipient, sender) {
    this.stompClient.send(
      '/chat/sendMessage/' + convoId,
      JSON.stringify({ message: message, recipient: recipient, sender: sender })
    );
  },
};

/*
export const WebSocketClient = {
  webSocket: null,


  connect(id) {
    try {
      this.webSocket = new WebSocket('ws://127.0.0.1:8080/api/chat/' + id);
      //
      // Implement WebSocket event handlers!
      //
      this.webSocket.onopen = function(event) {
        console.log('onopen::' + JSON.stringify(event, null, 4));
      };

      this.webSocket.onmessage = function(event) {
        let msg = event.data;
        console.log('onmessage::' + JSON.stringify(msg, null, 4));
      };
      this.webSocket.onclose = function(event) {
        console.log('onclose::' + JSON.stringify(event, null, 4));
      };
      this.webSocket.onerror = function(event) {
        console.log('onerror::' + JSON.stringify(event, null, 4));
      };
    } catch (exception) {
      console.error(exception);
    }
  },

  getStatus() {
    return this.webSocket.readyState;
  },
  send(message) {
    if (this.webSocket.readyState == WebSocket.OPEN) {
      this.webSocket.send(message);
    } else {
      console.error(
        'webSocket is not open. readyState=' + this.webSocket.readyState
      );
    }
  },
  disconnect() {
    if (this.webSocket.readyState == WebSocket.OPEN) {
      this.webSocket.close();
    } else {
      console.error(
        'webSocket is not open. readyState=' + this.webSocket.readyState
      );
    }
  },
};
*/
