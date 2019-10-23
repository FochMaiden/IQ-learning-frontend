<template>
  <v-container
    fluid
    class="fill-height"
    style="background-image: linear-gradient(to right, #fe7676, #f7717e, #ee6d85, #e46a8c, #d96891);"
  >
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card color="rgb(255, 255, 255, 0.7)">
          <v-toolbar
            style="display: flex; justify-content: center"
            class="primary--text"
          >
            <v-toolbar-title>
              LOGIN
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <!--          <v-row class="pa-0">
            <v-col class="pa-0">-->
          <v-card-title class="justify-center primary--text"> </v-card-title>
          <v-form class="pt-6 px-6 primary--text" v-model="valid">
            <v-text-field
              label="Login"
              name="login"
              v-model="username"
              type="text"
              autofocus
              filled
              :rules="[
                required('username'),
                minLength('username', 3),
                regexUsername()
              ]"
            ></v-text-field>
            <v-text-field
              id="password"
              label="Password"
              name="password"
              v-model="password"
              type="password"
              :rules="[
                required('password'),
                minLength(password, 8),
                passwordNumber(),
                passwordUppercase()
              ]"
              filled
            ></v-text-field>
            <v-checkbox
              v-model="rememberMe"
              label="Remember Me"
              data-vv-name="checkbox"
              type="checkbox"
              color="primary"
            ></v-checkbox>
          </v-form>
          <v-card-actions class="pb-6 px-6 justify-center">
            <v-btn
              large
              dark
              block
              style="background-image: linear-gradient(to right, #fe7676, #f7717e, #ee6d85, #e46a8c, #d96891);"
              :disabled="!valid"
              v-on:click="login"
              >Login</v-btn
            >
          </v-card-actions>
          <!--            </v-col>
&lt;!&ndash;            <v-col>
            </v-col>&ndash;&gt;
          </v-row>-->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: function() {
    return {
      username: null,
      password: null,
      rememberMe: true,
      valid: false
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
        rememberMe: this.rememberMe,
        success: function(response) {
          this.$auth.user(response.data);
          this.$auth.token(null, response.data.sessionID);
        },
        error: function(err) {}
        //redirect: { name: "home" }
      });
    },
    required(propertyType) {
      return v => (v && v.length > 0) || `You must input a ${propertyType}`;
    },
    minLength(propertyType, minLength) {
      return v =>
        (v && v.length >= minLength) ||
        `Must be at least ${minLength} characters`;
    },
    regexUsername() {
      let regexUsername = /^([a-zA-Z0-9\-._@+\\])*$/;
      return v =>
        regexUsername.test(v) ||
        "Your username contains not allowed characters.";
    },
    passwordUppercase() {
      let regexPasswordUpper = /[A-Z]+/;
      return v =>
        regexPasswordUpper.test(v) ||
        "Password must contain at least one uppercase letter";
    },
    passwordNumber() {
      let regexPasswordNumber = /[0-9]+/;
      return v =>
        regexPasswordNumber.test(v) ||
        "Password must contain at least one number";
    }
  }
};
</script>
<style scoped></style>
