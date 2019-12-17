<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card flat color="primary--text" height="35vh" shaped>
          <v-card-title> Welcome back {{ $auth.user().name }}! </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card flat color="primary--text" height="30vh" shaped>
          <v-card-title> Welcome back {{ $auth.user().name }}! </v-card-title>
        </v-card>
      </v-col>
      <v-col>
        <v-card flat color="primary" height="30vh" shaped>
          <v-card-title> Welcome back {{ $auth.user().name }}! </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card dark flat color="primary3" height="10vh" shaped>
          <v-card-text> Welcome back {{ $auth.user().name }}! </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card dark flat color="primary2" height="10vh" shaped>
          <v-card-text> Welcome back {{ $auth.user().name }}! </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card dark flat color="secondary" height="10vh" shaped>
          <v-card-text> Welcome back {{ $auth.user().name }}! </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'Dashboard',
};
</script>

<style scoped></style>
