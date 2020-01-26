<template>
  <v-container fluid class="ma-10">
    <v-layout row wrap align-center>
      <div v-for="article in loadArticles" :key="article.id">
        <v-container class="text-center" fluid>
          <v-row>
            <v-col>
              <v-card class="mx-auto" max-width="400">
                <v-img
                  :src="articleImg(article.image)"
                  class="white--text align-end"
                  height="200px"
                  dark
                >
                  <v-card-title> {{ article.title }}! </v-card-title>
                </v-img>
                <v-card-text v-if="article.description">
                  {{ article.description.substring(0, 300) + '...' }}
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    small
                    replace
                    color="info"
                    :data="article.id"
                    :to="'articles/' + article.id"
                    @click="addArticleId(article.id)"
                    >Read More</v-btn
                  >
                  <span class="d-flex justify-end float-right ml-2"
                    ><v-icon>mdi-thumb-up</v-icon
                    ><span class="float-right ml-2">{{
                      article.upvotes
                    }}</span></span
                  >
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
import { b64toBlob } from '../util/utilFunctions';

export default {
  data() {
    return {
      imgSrc: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
      articles: [],
    };
  },
  computed: {
    loadArticles() {
      return this.$store.state.articles;
    },
    articleImg() {
      return function(imga) {
        if (imga) {
          let photo = atob(imga);
          let pic = b64toBlob(photo, 'image/png');
          let image = new Image();
          image.src = URL.createObjectURL(pic);
          return image;
        } else
          return 'https://images.unsplash.com/photo-1508138221679-760a23a2285b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80';
      };
    },
  },
  created() {
    this.$store.dispatch('loadArticles');
  },
  methods: {
    /* decodeImg(image) {
      this.$store.state.articles.map(
        image => (this.Article.image = atob(image))
      );
      this.image = atob(this.image);
      return this.image;
    },*/
    addArticleId(id) {
      console.log(id);
      //:to="'articles/' + article.id"
      this.$store.commit('setCurrentArticle', id);
      //console.log(this.$store.state.currentArticle)
    },
  },
};
</script>
