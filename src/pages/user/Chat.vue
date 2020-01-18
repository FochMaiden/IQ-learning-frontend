<template>
  <v-container>
    <v-row>
      <v-col cols="4s">
        <v-card elevation="4">
          <v-list dense subheader>
            <v-subheader>Recent chat</v-subheader>
            <v-list-item
              dense
              v-for="user in users"
              :key="user.name"
              @click="selectUser(user)"
            >
              <v-list-item-avatar>
                <v-img :src="user.avatar"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item
                  class="overline font-weight-bold"
                  style="font-size: small !important;"
                  v-text="user.name"
                ></v-list-item>
              </v-list-item-content>

              <v-list-item-action class="overline">
                {{ user.date }}
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <!--          <v-list subheader>
            <v-subheader>Previous chats</v-subheader>

            <v-list-item v-for="item in items2" :key="item.title" @click="">
              <v-list-item-avatar>
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list>-->
        </v-card>
      </v-col>
      <v-col cols="8" v-if="selectedUser">
        <v-card elevation="4">
          <v-card-title>
            {{ selectedUser.name }}
          </v-card-title>
          <v-list
            id="blep"
            style="max-height: 30vh"
            class="overflow-y-auto d-flex flex-column-reverse"
          >
            <!--           id:96
            message:"a"
            read:false
            recipient:4
            sender:5
            sent:"2020-01-16T17:09:35.473+0000"-->
            <v-list-item v-for="message in selectedUser.messages">
              <v-container fluid class="pa-0">
                <v-avatar
                  v-if="$auth.user().avatar"
                  size="20"
                  :class="
                    message.sender !== $auth.user().id
                      ? 'float-left'
                      : 'float-right'
                  "
                  ><v-img :src="$auth.user().avatar"></v-img
                ></v-avatar>
                <v-card
                  :class="
                    message.sender !== $auth.user().id
                      ? 'float-left pa-2'
                      : 'float-right pa-2'
                  "
                  color="primary"
                >
                  <v-list-item-content class="pa-0 ma-0">{{
                    message.message
                  }}</v-list-item-content>
                </v-card>
              </v-container>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-card-actions>
            <v-form @submit.prevent="sendMessage" class="flex flex-wrap">
              <v-text-field
                clearable
                hide-details
                outlined
                dense
                v-model="message"
                class="ma-2"
              ></v-text-field>
              <v-btn outlined class="ma-2" type="submit" color="primary"
                >send
              </v-btn>
            </v-form>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { restApi } from '../../api/restApi';
import { stompClientSocket } from '../../api/wsApi';

export default {
  name: 'Chat',
  computed: {
    className() {
      return this.data;
    },
  },
  data() {
    return {
      selectedUser: null,
      message: null,
      users: [
        {
          id: 4,
          name: 'Archangel',
          avatar: '',
          messages: [],
          date: '21.06.2019',
        },
        {
          id: 5,
          name: 'FochMaiden',
          avatar: '',
          messages: [],
          date: '21.06.2019',
        },
      ],
    };
  },
  methods: {
    scrollToEnd() {
      let container = this.$el.querySelector('#blep');
      container.scrollTop = container.scrollHeight;
    },
    selectUser(user) {
      this.selectedUser = user;
      this.getMessages();
    },
    sendMessage() {
      stompClientSocket.sendMessage(
        this.message,
        this.selectedUser.id,
        this.$auth.user().id
      );

  /*    restApi.sendMessage(this.message, this.selectedUser.id).then(r => {
        this.message = null;
        this.getMessages();
      });*/
    },
    getMessages() {
      restApi.getMessages(this.selectedUser.id).then(response => {
        this.selectedUser = {
          ...this.selectedUser,
          messages: response,
        };
        this.scrollToEnd();
      });
    },
  },
};
</script>

<style scoped></style>
