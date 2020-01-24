<template>
  <v-container fluid class="ma-12">
    <v-layout row wrap align-center>
      <p>{{}}</p>
      <v-card max-width="344" class="mx-auto">
        <v-list-item>
          <v-list-item-avatar color="grey"></v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline">{{
              article[0].title
            }}</v-list-item-title>
            <v-list-item-subtitle
              >by {{ article[0].owner.username }}</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>

        <v-img
          :src="articleImg(article.image)"
          class="white--text align-end"
          height="200px"
          dark
        ></v-img>

        <v-card-text>
          <div v-html="articleContent(article[0].content)"></div>
        </v-card-text>

        <v-card-actions>
          <v-btn text color="deep-purple accent-4">
            Read
          </v-btn>
          <v-btn text color="deep-purple accent-4">
            Bookmark
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
	import {b64toBlob} from '../util/utilFunctions';
	import {restApi} from '../api/restApi';

	export default {
  data() {
    return {
      article: [],
      urlId: null,
      comments: [],
    };
  },
  computed: {
    /*article() {
		  //this.$store.state.articles.map(image=> this.article.image=atob(image));
		  /!* console.log('przed',this.urlId);
           if (this.urlId === null) {
             this.urlId = this.$route.params.id;
               console.log('po',this.urlId);
             return this.$store.state.articles.filter(item => {
               return item.id.toString() === this.urlId;
             });

             return this.$store.state.article;
           }*!/
	  },*/
    articleImg() {
      return function(imga) {
        if (imga) {
          let blep = atob(imga);
          let blop = b64toBlob(blep, 'image/png');
          var image = new Image();
          image.src = URL.createObjectURL(blop);
          //console.log(image.src, 'blep');
          return image;
        } else
          return 'https://images.unsplash.com/photo-1508138221679-760a23a2285b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80';
      };
    },
    articleContent() {
      return function(contencik) {
        if (contencik) {
          let blap = atob(contencik);
          return blap;
        }
      };
    },
  },
  created() {
    //console.log('im here');
    //this.helper();

    console.log('przed', this.urlId);

    this.urlId = this.$route.params.id;
    let kupa = this.$store.state.articles.filter(item => {
      return item.id.toString() === this.urlId;
    });
    this.article = kupa;

    this.getComments(this.article[0].id);

    // this.$store.dispatch('setArticle',this.$store.state.article);
    ///this.article()
  },
  methods: {
    helper() {
      //console.log(this.article[0]);
    },
    getComments() {
      console.log('im here');
      console.log('this.article[0].id', this.article[0].id);
      restApi
        .getArticleComments(this.article[0].id)
        .then(response => {
          this.comments = response;
          console.log('comments', this.comments);
          return response;
        })
        .catch(err => {
          this.error = err;
        });
    },
  },
};
</script>
