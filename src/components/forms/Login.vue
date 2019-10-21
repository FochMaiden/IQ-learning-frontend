<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login form</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Login"
                name="login"
                v-model="username"
                type="text"
              ></v-text-field>
              <v-text-field
                id="password"
                label="Password"
                name="password"
                v-model="password"
                type="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-on:click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      username: null,
      password: null
    };
  },
  methods: {
    login() {
      this.$auth.login({
        url: "/user/login",
        method: "POST",
        headers: {
          authorization: "bearer null"
        },
        data: {
          username: this.username,
          password: this.password
        },
        fetchUser: false,
        rememberMe: true,
        success: function(response) {
          console.log(response.data);
          this.$auth.token(null, response.data.sessionID);
        },
        error: function(err) {},
        redirect: { name: "home" }
      });
    }
  }
};
</script>
