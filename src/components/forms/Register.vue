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
              REGISTER
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-form class="pt-6 px-6 primary--text" v-model="valid">
            <v-text-field
              label="Username"
              name="username"
              v-model="username"
              type="text"
              autofocus
              filled
              :rules="[
                regexUsername(),
                required('username'),
                minLength('username', 3)
              ]"
            >
              <v-icon slot="append" color="accent">
                fas fa-user-tie
              </v-icon>
            </v-text-field>
            <v-text-field
              label="E-mail"
              name="email"
              v-model="email"
              type="text"
              :rules="[required('email'), regexEmail()]"
              filled
            >
              <v-icon slot="append" color="accent">
                fas fa-envelope
              </v-icon>
            </v-text-field>
            <v-text-field
              label="Name"
              name="name"
              v-model="name"
              type="text"
              filled
              :rules="[isName()]"
            ></v-text-field>
            <v-text-field
              label="Surname"
              name="surname"
              v-model="surname"
              type="text"
              filled
              :rules="[isName()]"
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
            <p>{{ error }}</p>
            <v-checkbox
              v-model="autoLogin"
              label="Login automatically"
              data-vv-name="checkbox"
              type="checkbox"
              color="primary"
            ></v-checkbox>
          </v-form>

          <v-spacer></v-spacer>
          <v-card-actions class="pb-6 px-6 justify-center">
            <v-btn
              large
              dark
              block
              style="background-image: linear-gradient(to right, #fe7676, #f7717e, #ee6d85, #e46a8c, #d96891);"
              v-on:click="register"
              :disabled="!valid"
              >Register</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { required } from "./validationFunctions.js";
import {
  isName,
  minLength,
  passwordNumber,
  passwordUppercase,
  regexEmail,
  regexUsername
} from "./validationFunctions";

export default {
  name: "Register",
  data: function() {
    return {
      username: null,
      email: null,
      name: null,
      surname: null,
      password: null,
      autoLogin: true,
      valid: false,
      error: "",
      required,
      regexEmail,
      passwordNumber,
      regexUsername,
      minLength,
      passwordUppercase,
      isName
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
        autoLogin: this.autoLogin,
        rememberMe: true,
        success: async function(response) {
          if (!response.data.isError) {
            this.$auth.user(response.data);
            this.$auth.token(null, response.data.sessionID);
          } else {
            this.$router.push("/login");
          }
        },
        error: function(err) {
          if (err.response.data) {
            this.error = err.response.data;
          }
        }
      });
    }
  }
};
</script>
<style scoped></style>
