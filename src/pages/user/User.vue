<template>
  <v-container fluid class="fill-height">
    <v-navigation-drawer width="25vh" floating permanent app>
      <template v-slot:prepend>
        <v-list class="pt-10 p">
          <v-list-item  >
            <v-avatar class="profile ma-auto" >
              <v-img :src="ico"></v-img>
            </v-avatar>
            <v-list-item-title >IQ Learning</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
      <v-list class="pt-10">
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <router-view />
    <v-navigation-drawer width="35vh" right floating permanent app>
      <template v-slot:prepend>
        <v-list class="pt-10 p">
          <v-list-item class="flex justify-space-between" v-on:click="logout">
            <v-list-item-title style="color: grey">Logout</v-list-item-title>
            <v-icon color="primary">mdi-logout-variant</v-icon>
          </v-list-item>
        </v-list>
      </template>
      <v-list class="d-flex flex-wrap">
        <v-avatar color="primary" size="120" class="ma-auto">
          <v-fab-transition>
            <v-btn dark x-small absolute bottom right fab>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-fab-transition>
          <span class="white--text headline">{{
            $auth.user().name[0] + $auth.user().surname[0]
          }}</span>
        </v-avatar>
        <v-list-item two-line align="center" class="mt-3 flex flex-wrap">
          <v-list-item-title class="title">
            {{ $auth.user().name }}
            {{ $auth.user().surname }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ $auth.user().email }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      items: [{ title: 'Dashboard', to: {name: 'dashboard'}, icon: 'mdi-view-dashboard-outline' }],
      ico: require('../../assets/wisdom.svg'),
    };
  },
  methods: {
    logout() {
      this.$auth.logout();
    },
  },
};
</script>

<style scoped></style>
