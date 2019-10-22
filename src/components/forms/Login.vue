<template>
  <v-container
    fluid
    class="fill-height"
    style="background-image: linear-gradient(to right, #fe7676, #f7717e, #ee6d85, #e46a8c, #d96891);"
  >
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="5">
        <v-card color="rgb(255, 255, 255, 0.8)" dark >
          <v-row>
            <v-col>
              <v-card-title class="justify-center primary--text">
              </v-card-title>
              <v-form class="pa-6 primary--text">
                <v-text-field
                  label="Login"
                  name="login"
                  v-model="username"
                  type="text"
                  autofocus
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
              <v-card-actions style="padding-bottom: 1.5em" class="justify-center">
                <v-btn large dark style="background-image: linear-gradient(to right, #fe7676, #f7717e, #ee6d85, #e46a8c, #d96891);"   v-on:click="login"
                  >Login</v-btn
                >
              </v-card-actions>
            </v-col>
<!--            <v-col>
            </v-col>-->
          </v-row>
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
          this.$auth.user(response.data);
          this.$auth.token(null, response.data.sessionID);
        },
        error: function(err) {}
        //redirect: { name: "home" }
      });
    }
  }
};
</script>
<style scoped></style>
