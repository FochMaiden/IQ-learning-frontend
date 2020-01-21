<template>
  <v-container>
    <v-row>
      <v-col cols="4s">
        <v-card elevation="4">
          <v-list dense subheader>
            <v-subheader>Recent chat</v-subheader>
            <v-list-item
              dense
              v-for="(user, k, i) in $auth.user().conversations"
              :key="user.name"
              @click="selectUser(user, k)"
            >
              <v-list-item-avatar v-if="user.avatar">
                <v-img :src="user.avatar"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item
                  class="overline font-weight-bold"
                  style="font-size: small !important;"
                  v-text="user.username"
                ></v-list-item>
              </v-list-item-content>
              <!--              <v-list-item-action class="overline">
                {{ user.date }}
              </v-list-item-action>-->
            </v-list-item>
          </v-list>

          <v-divider></v-divider>
        </v-card>
      </v-col>
      <v-col cols="8" v-if="selectedUser">
        <v-card elevation="4">
          <v-card-title>
            {{ selectedUser.username }}
          </v-card-title>
          <v-list
            id="chat"
            style="max-height: 30vh"
            class="overflow-y-auto d-flex flex-column"
          >
            <v-list-item
              v-for="message in $store.getters.messages[selectedUserConvoId]"
            >
              <v-container fluid class="pa-0">
                <v-avatar
                  size="30"
                  :class="
                    message.sender !== $auth.user().id
                      ? 'float-left'
                      : 'float-right'
                  "
                  ><v-img
                    v-if="
                      $auth.user().avatar && message.sender === $auth.user().id
                    "
                    :src="$auth.user().avatar"
                  />
                  <v-img
                    v-if="
                      selectedUser.avatar && message.sender === selectedUser.id
                    "
                    :src="selectedUser.avatar"
                  />
                </v-avatar>
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
            <v-form
              ref="form"
              @submit.prevent="sendMessage"
              class="flex flex-wrap"
            >
              <v-text-field
                      clearable
                      hide-details
                      outlined
                      dense
                      v-model="message"
                      class="ma-2"
              />
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
import { stompClientSocket } from '../../api/wsApi';

export default {
  name: 'Chat',
  data() {
    return {
      selectedUser: null,
      selectedUserConvoId: null,
      message: null,
    };
  },
  methods: {
    scrollToEnd() {
      let container = this.$el.querySelector('#chat');
      container.scrollTop = container.scrollHeight - container.clientHeight;
    },
    selectUser(user, convoId) {
      this.selectedUser = user;
      this.selectedUserConvoId = convoId;
      //this.scrollToEnd();
    },
    sendMessage() {
      stompClientSocket.sendMessage(
        this.selectedUserConvoId,
        this.message,
        this.selectedUser.id,
        this.$auth.user().id
      );
      this.$refs.form.reset();
      this.scrollToEnd();
    },
    startconvo() {
      stompClientSocket.startConversation('blep', 3, 5);
    },
  },
};
</script>

<style scoped></style>
