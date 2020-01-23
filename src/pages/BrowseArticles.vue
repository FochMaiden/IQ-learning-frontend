<template>
  <v-container fluid class="ma-10">
    <v-layout row wrap align-center>
      <div v-for="article in loadArticles" :key="article.title">
        <v-container class="text-center" fluid>
          <v-row>
            <v-col>
              <v-card class="mx-auto" max-width="400">
                <v-img
                  class="white--text align-end"
                  height="200px"
                  :src="`data:image/png;base64,article.image`"
                >
                  <v-card-title> {{ article.title }}! </v-card-title>
                </v-img>
                <v-card-text>
                  {{ article.content.substring(0, 300) + '...' }}
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    small
                    replace
                    color="info"
                    target="_blank"
                    @click="getOneArticle(article)"
                    >Read More</v-btn
                  >
                  <v-btn icon><v-icon>mdi-thumb-up</v-icon></v-btn>
                  <p>{{ article.upvotes }}</p>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
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
    loadArticles() {
      //this.$store.state.articles.map(image=> this.article.image=);
      return this.$store.state.articles;
    },
  },
  created() {
    this.$store.dispatch('loadArticles');
  },
  methods: {
    decodeImg(image) {
      this.$store.state.articles.map(
        image => (this.Article.image = atob(image))
      );
      this.image = atob(this.image);
      return this.image;
    },
    getOneArticle(article) {

      console.log(article);
	    this.$store.dispatch('loadArticle',article);//do i?
      return article;
    },
  },
};
</script>
