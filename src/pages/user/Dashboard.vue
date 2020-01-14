<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card flat class="mt-12" color="primary--text" height="35vh" shaped>
          <v-sheet
            class="v-sheet--offset mx-auto float-right"
            color="transparent"
          >
            <v-avatar size="100">
              <v-img src="https://picsum.photos/id/11/500/300"> </v-img>
            </v-avatar>
          </v-sheet>
          <v-card-title> Welcome back {{ $auth.user().name }}! </v-card-title>
          <v-card-text>Checkout your latest trending tests!</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card flat color="primary--text" height="30vh" shaped>
          <v-card-title> </v-card-title>
        </v-card>
      </v-col>
      <v-col>
        <v-card flat color="primary" height="30vh" shaped> </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card dark flat color="primary3" height="10vh" shaped> </v-card>
      </v-col>
      <v-col>
        <v-card dark flat color="primary2" height="10vh" shaped> </v-card>
      </v-col>
      <v-col>
        <v-card dark flat color="secondary" height="10vh" shaped> </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      labels: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'],
      value: [200, 675, 410, 390, 310, 460, 250, 240],
    };
  },
};
</script>

<style scoped>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>
