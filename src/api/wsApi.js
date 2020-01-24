import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

import store from '../store/store';
import {restApi} from './restApi';

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
      if (
        JSON.parse(sendMessage.body).body &&
        JSON.parse(sendMessage.body).body.conversationId
      ) {
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
  disconnect() {
    this.stompClient.disconnect(() => {
      console.log('disconnectd');
    }, {});
  },
};
