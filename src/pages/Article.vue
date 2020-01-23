<template>
  <v-container fluid class="ma-10">
    <v-layout row wrap align-center>
      <div>
        <p>{{ article }}</p>
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
    article() {
      //this.$store.state.articles.map(image=> this.article.image=atob(image));
      console.log(this.$route.params.id)
     return  this.$store.state.articles.filter(item=>{
        return item.id.toString() === this.$route.params.id
      })

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
