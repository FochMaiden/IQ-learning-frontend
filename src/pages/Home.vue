<template>
  <v-container fluid class="fill-height">
    <BrowseArticles />
  </v-container>
</template>

<script>
import BrowseArticles from './creator/Articles/BrowseArticles';

export default {
  name: 'Home',
  components: { BrowseArticles },
};
</script>

<style scoped></style>
