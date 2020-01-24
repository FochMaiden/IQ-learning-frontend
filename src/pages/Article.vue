<template>
  <v-container fluid class="mx-auto">
    <v-layout row wrap align-center>
      <p>{{}}</p>
      <v-card max-width="auto" class="mx-auto">
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
        <v-card max-width="600" elevation="12" class="pa-12">
          <v-text-field
            max-width="50%"
            v-model="model"
            :label="label"
            :hint="hint"
            :placeholder="placeholder"
            :shaped="shaped"
            :outlined="outlined"
            :rounded="rounded"
            :solo="solo"
            :single-line="singleLine"
            :filled="filled"
            :clearable="clearable"
            :persistent-hint="persistentHint"
            :loading="loading"
            :flat="flat"
            :counter="counterEn ? counter : false"
            :dense="dense"
          ></v-text-field>
          <div class="mt-12 text-center">Value: {{ model }}</div>
          <v-btn primary outlined small fab
            >add<!--<v-icon>mdi-plus</v-icon>--></v-btn
          >
        </v-card>
      </v-card>
    </v-layout>
    <v-card
      v-for="comment in commentsComputed"
      :key="comment.id"
      class="d-flex flex-column mx-auto"
      max-width="50%"
    >
      <v-list-item class="d-flex flex-column">
        <v-list-item-title class="font-italic font-weight-bold">
          {{ comment.commentator.username }}
        </v-list-item-title>

        <v-list-item disabled>
          <v-card maxWidth="100%"
            ><v-list-item-title>{{
              comment.comment
            }}</v-list-item-title></v-card
          >
        </v-list-item>
        <v-list-item>
          <v-list-item-title>{{ comment.upvotes }}</v-list-item-title>
        </v-list-item>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script>
import { b64toBlob } from '../util/utilFunctions';
import { restApi } from '../api/restApi';

export default {
  data() {
    return {
      article: [],
      urlId: null,
      comments: [],
      model: "I'm a text field",
      label: 'Hey!',
      hint: 'Customize me!',
      placeholder: '',
      shaped: false,
      outlined: false,
      rounded: false,
      solo: false,
      singleLine: false,
      filled: false,
      clearable: false,
      persistentHint: false,
      loading: false,
      flat: false,
      counterEn: false,
      counter: 0,
      dense: false,
    };
  },
  computed: {
    commentsComputed() {
      //console.log('alan',this.article[0].id)
      console.log('alan', this.comments);
      return this.comments;
    },
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
    getComments(id) {
      console.log('im here');
      console.log('this.article[0].id', this.article[0].id);
      restApi
        .getArticleComments(id)
        .then(response => {
          this.comments = response;
          //console.log('comments', response);
          return this.comments;
        })
        .catch(err => {
          this.error = err;
        });
    },
  },
};
</script>
