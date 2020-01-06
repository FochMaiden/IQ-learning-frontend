<template>
  <v-container>
    <v-toolbar-title align="center" class="primary--text"
      >Select subject</v-toolbar-title
    >
    <v-row align="center" justify="center">
      <v-col cols="4" v-for="subject in $store.state.subjects">
        <v-hover v-slot:default="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            class="mx-auto"
            height="200"
            max-width="350"
            :to="'id=' + subject.id"
            @click="expand = !expand"
            shaped
          >
            <v-card-text class="my-4 text-center title">{{
              subject.name
            }}</v-card-text>
            <v-card-text class="my-4 text-center title">{{
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
