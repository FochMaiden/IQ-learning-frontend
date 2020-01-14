<template>
  <v-container>
    <v-row>
      <v-col cols="4s">
        <v-card>
          <v-list dense subheader>
            <v-subheader>Recent chat</v-subheader>
            <v-list-item dense v-for="user in users" :key="user.name" @click="selectUser(user)">
              <v-list-item-avatar>
                <v-img :src="user.avatar"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item class='overline font-weight-bold' style='font-size: small !important;' v-text="user.name"></v-list-item>
              </v-list-item-content>

              <v-list-item-action class='overline'>
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
      <v-col cols="8" v-if='selectedUser'>
        <v-list>
          <v-list-item>
            <v-list-item-title>
              {{ selectedUser.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Chat',
  data() {
    return {
      selectedUser: null,
      users: [
        {
          name: 'huu',
          avatar: '',
          date: '21.06.2019',
        },
        { name: 'bleop', avatar: '', date: '21.06.2019' },
        { name: 'annnn', avatar: '', date: '21.06.2019' },
        { name: 'kiep', avatar: '', date: '21.06.2019' },
      ],
    };
  },
  methods: {
    selectUser(user) {
      this.selectedUser = user;

    }
  },
};
</script>

<style scoped></style>
