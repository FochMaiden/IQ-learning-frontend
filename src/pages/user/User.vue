<template>
  <v-container fluid>
    <left-nav></left-nav>
    <router-view />
    <right-nav></right-nav>
  </v-container>
</template>

<script>
import RightNav from '../../templates/RightNav';
import LeftNav from '../../templates/LeftNav';

export default {
  name: 'User',
  components: {
    LeftNav,
    RightNav,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.theme--light.v-list-item--active:hover::before,
.theme--light.v-list-item--active::before {
  opacity: 0 !important;
}
</style>
