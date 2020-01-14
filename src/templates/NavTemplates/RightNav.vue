<template>
  <v-navigation-drawer
    v-if="!isMobile"
    width="35vh"
    right
    floating
    permanent
    app
  >
    <template v-slot:prepend> </template>
      <v-list class="d-flex flex-wrap">
        <v-avatar color="accent" size="120" class="ma-auto">
          <v-btn dark small absolute bottom right fab to="/user/settings">
            <v-icon>settings</v-icon>
          </v-btn>
          <v-img
            class="ma-auto"
            v-if="$auth.user().avatar"
            :src="$auth.user().avatar"
          ></v-img>
          <span v-else class="white--text headline">
            {{ initials }}
          </span>
        </v-avatar>
        <v-list-item two-line align="center" class="mt-3 flex flex-wrap">
          <v-list-item-title class="headline">
            {{ this.getName }}
          </v-list-item-title>
          <v-list-item-subtitle class='overline'>
            {{ $auth.user().email }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list>
          <v-list-item class="flex justify-space-between" v-on:click="logout">
            <v-list-item-title style="color: grey">Logout</v-list-item-title>
            <v-icon color="primary">mdi-logout-variant</v-icon>
          </v-list-item>
        </v-list>
      </template>

  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'RightNav',
  methods: {
    logout() {
      this.$auth.logout();
    },
    checkInitials() {
      if (this.$name && this.$surname) {
        return this.getInitials(this.$name, this.$surname, false);
      } else if (this.$name) {
        return this.getInitials(this.$name, this.$name);
      } else if (this.$surname) {
        return this.getInitials(this.$surname, this.$surname);
      } else return this.getInitials(this.$username, this.$username);
    },
    getInitials(firstString, secondString, isSameString = true) {
      isSameString
        ? (this.initials = firstString[0] + secondString[1])
        : (this.initials = firstString[0] + secondString[0]);
    },
  },
  data() {
    return {
      initials: '',
    };
  },
  created() {
    this.checkInitials();
  },
  computed: {
    isMobile() {
      return !(
        this.$vuetify.breakpoint.name === 'lg' ||
        this.$vuetify.breakpoint.name === 'xl'
      );
    },
    getName() {
      if (this.$auth.user().name && this.$auth.user().surname) {
        return this.$auth.user().name + ' ' + this.$auth.user().surname;
      } else return this.$auth.user().username;
    },
  },
};
</script>

<style scoped></style>
