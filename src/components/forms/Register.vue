<template>
  <v-container
    style="background-image: linear-gradient(to right, #fe7676, #f7717e, #ee6d85, #e46a8c, #d96891);"
    fluid
    class="fill-height"
  >
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card color="rgb(255, 255, 255, 0.8)" dark>
          <v-form class="pa-6 primary--text">
            <v-text-field
              label="Username"
              name="username"
              v-model="username"
              type="text"
              autofocus
              filled
              solo
            ></v-text-field>
            <v-text-field
              label="E-mail"
              name="email"
              v-model="email"
              type="text"
              filled
              solo
            ></v-text-field>
            <v-text-field
              label="Name"
              name="name"
              v-model="name"
              type="text"
              filled
              solo
            ></v-text-field>
            <v-text-field
              label="Surname"
              name="surname"
              v-model="surname"
              type="text"
              filled
              solo
            ></v-text-field>
            <v-text-field
              id="password"
              label="Password"
              name="password"
              v-model="password"
              type="password"
              filled
              solo
            ></v-text-field>
          </v-form>
          <v-spacer></v-spacer>
          <v-card-actions style="padding-bottom: 1.5em" class="justify-center">
            <v-btn
              large
              dark
              style="background-image: linear-gradient(to right, #fe7676, #f7717e, #ee6d85, #e46a8c, #d96891);"
              v-on:click="register"
              >Register</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      username: null,
      email: null,
      name: null,
      surname: null,
      password: null
    };
  },
  methods: {
    register() {
      this.$auth.register({
        url: "/user/register",
        method: "POST",
        headers: {
          authorization: "bearer null"
        },
        data: {
          username: this.username,
          email: this.email,
          name: this.name,
          surname: this.surname,
          password: this.password
        },
        autoLogin: false,
        rememberMe: true,
        success: function(response) {
          this.$auth.user(response.data);
          this.$auth.token(null, response.data.sessionID);
        },
        error: function(err) {}
      });
    }
  }
};
</script>

<style scoped></style>
