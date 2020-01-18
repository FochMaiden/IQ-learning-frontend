import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

const options = { debug: true, heartbeat: false, protocols: ['v12.stomp'] };

export const stompClientSocket = {
  socket: null,
  stompClient: null,


  connect() {
    this.socket = new SockJS('http://localhost:8080/gs-guide-websocket');
    this.stompClient = Stomp.over(this.socket, options);
    return this.stompClient.connect({}, async () => {
      await this.subscribeToTopic(5);
      await this.subscribeToChat(5);
    });
  },
  subscribeToTopic(id) {
    this.stompClient.subscribe('/topic/' + id, sendMessage => {
      console.log('hello', sendMessage);
    });
  },
  subscribeToChat(id) {
    this.stompClient.subscribe('/chat/' + id, sendMessage => {
      console.log(JSON.parse(sendMessage.body).content);
      console.log(sendMessage);
    });
  },
  sendMessage(message, recipient, sender) {
    this.stompClient.send(
      '/chat/sendMessage/'+ recipient,
      JSON.stringify({ message: message, recipient: recipient, sender: sender })
    );
    this.stompClient.send(
        '/chat/sendMessage/'+ sender,
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
