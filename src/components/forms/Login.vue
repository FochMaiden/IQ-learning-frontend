<template>
  <v-container style="background-image: " fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-form>
          <v-text-field
            label="Login"
            name="login"
            v-model="username"
            type="text"
            outlined
            rounded
          ></v-text-field>
          <v-text-field
            id="password"
            label="Password"
            name="password"
            v-model="password"
            type="password"
            outlined
            rounded
          ></v-text-field>
        </v-form>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn class="primary" block rounded v-on:click="login">Login</v-btn>
        </v-card-actions>
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
        url: "/user/token",
        method: "POST",
        headers: {
          Authorization: "bearer null"
        },
        data: {
          username: this.username,
          password: this.password
        },
        fetchUser: false,
        rememberMe: true,
        success: function(response) {
          console.log(response.data);
          this.$auth.token(null, response.data.token);
        },
        error: function(err) {},
        //redirect: { name: "home" }
      });
    }
  }
};
</script>
