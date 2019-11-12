<template>
  <v-navigation-drawer :mini-variant.sync="isMobile" floating permanent app>
    <template v-slot:prepend>
      <v-list class="pt-10 p">
        <v-list-item>
          <v-avatar class="profile ma-auto" to="/">
            <v-img :src="ico"></v-img>
          </v-avatar>
          <v-list-item-title>IQ Learning</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
    <v-list class="pt-12">
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.to"
        link
        :style="
          item.to === $route.path
            ? 'color: #fe7676 !important; border-width: 0 !important; border-right: 0.1em solid !important; background-color: rgba(0,0,0,0) !important;'
            : 'color: rgb(0,0,0,0) !important;  border-width: 0 !important; border-right: 0.1em solid !important;'
        "
      >
        <v-list-item-icon>
          <v-icon
            :style="
              item.to === $route.path
                ? 'color: #fe7676 !important;'
                : 'color: rgb(0,0,0, 0.4) !important;'
            "
            >{{ item.icon }}</v-icon
          >
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title
            :style="
              item.to === $route.path
                ? 'color: black !important;'
                : 'color: rgb(0,0,0, 0.4) !important;'
            "
            >{{ item.title }}</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <!--				<template v-slot:append>
						HELLO
				</template>-->
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'leftnav',
  data() {
    return {
      items: [
        { title: 'Dashboard', to: '/user', icon: 'mdi-view-dashboard-outline' },
        {
          title: 'Questions',
          to: '/user/q',
          icon: 'mdi-file-question-outline',
        },
        { title: 'Chat', to: '/user/s', icon: 'mdi-forum-outline' },
      ],
      ico: require('../../assets/wisdom.svg'),
    };
  },
  computed: {
    isMobile() {
      return !(
        this.$vuetify.breakpoint.name === 'lg' ||
        this.$vuetify.breakpoint.name === 'xl'
      );
    },
  },
};
</script>

<style scoped></style>
