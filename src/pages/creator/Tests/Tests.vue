<template>
  <v-container>
    <v-toolbar-title align="center" class="primary--text"
      >Browse all of your tests</v-toolbar-title
    >
    <v-row align="center" justify="center">
      <v-col cols="2">
        <v-hover v-slot:default="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            class="mx-auto"
            max-height="150"
            max-width="150"
            :to="'user/id=all'"
            @click="expand = !expand"
            shaped
          >
            <v-card-text class="mt-1 text-center title"> ALL </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-toolbar-title align="center" class="primary--text"
      >Or select subject</v-toolbar-title
    >
    <v-row align="center" justify="center">
      <v-col cols="2" v-for="subject in $store.state.subjects">
        <v-hover v-slot:default="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            class="mx-auto"
            max-height="150"
            max-width="150"
            :to="'user/' + 'id=' + subject.id"
            @click="expand = !expand"
            shaped
          >
            <v-card-text class="my-1 pa-2 text-center title">{{
              subject.name
            }}</v-card-text>
            <v-card-text class="my-1 pa-2 text-center title">{{
              subject.year
            }}</v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from '../../../store/store';

export default {
  name: 'Tests',
  data() {
    return {
      expand: false,
    };
  },
  created() {
    store.dispatch('loadUserTests');
  },
  methods: {
    goTo(subject) {
      console.log(subject);
    },
  },
};
</script>

<style scoped></style>
