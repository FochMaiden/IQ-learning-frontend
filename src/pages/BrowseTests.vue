<template>
  <v-container>
    <v-toolbar dense floating>
      <v-text-field
        hide-details
        prepend-icon="search"
        single-line
      ></v-text-field>
    </v-toolbar>

    <v-card>
      {{ $store.state.publicTests }}
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'BrowseTests',
  created() {
    this.$store.dispatch('loadPublicTests');
  },
};
</script>

<style scoped></style>
