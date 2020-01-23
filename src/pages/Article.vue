<template>
  <v-container fluid class="ma-10">
    <v-layout row wrap align-center>
      <div>
        <p>{{ loadArticle }}</p>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      imgSrc: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
      articles: [],
    };
  },
  computed: {
    loadArticle() {
      //this.$store.state.articles.map(image=> this.article.image=atob(image));
      console.log(this.$store.state.article);
      return this.$store.state.article;
    },
  },
  created() {
    console.log('im here');
    //sthis.$store.dispatch('loadArticle');
  },
  methods: {},
};
</script>
