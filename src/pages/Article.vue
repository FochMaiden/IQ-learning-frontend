<template>
  <v-container fluid class="mx-auto mt-12">
    <v-layout row wrap align-center mb-5>
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
      </v-card>
    </v-layout>
    <v-card
      v-for="comment in commentsComputed"
      class=" pa-2 mb-1 comment"
      :key="comment.id"
    >
      <v-card class="grey lighten-3 ma-5 pa-5">
        <p>{{ comment.comment }}</p>
      </v-card>
      <div class="ma-5">
        <p class="font-italic">
          {{ comment.commentator.username }} <span>&bull;</span>
          {{ comment.createdOn.substring(0, 10) }}
        </p>
        <span class="d-flex justify-end"
          ><v-btn icon @click="addVote(comment)"
            ><v-icon>mdi-thumb-up</v-icon
            ><span class="float-right ml-2">{{ comment.upvotes }}</span></v-btn
          ></span
        >
      </div>
    </v-card>
    <v-card class=" pa-2 mb-1 comment">
      <v-card class="grey lighten-3 ma-5 pa-5">
        <v-text-field
          max-width="50%"
          v-model="comment"
          :rules="[required('comment')]"
          :label="label"
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
      </v-card>
      <span class="d-flex justify-end"
        ><v-btn
          primary
          outlined
          small
          fab
          icon
          @click="addComment(comment)"
          ><v-icon>mdi-plus</v-icon></v-btn
        ></span
      >
    </v-card>
  </v-container>
</template>

<script>
	import {b64toBlob} from '../util/utilFunctions';
	import {restApi} from '../api/restApi';
	import {required} from '../util/validationFunctions';

	export default {
  data() {
    return {
      article: [],
      urlId: null,
      comments: [],
      comment: '',
      label: 'Enter comment',
      placeholder: 'add your comment',
      shaped: false,
      required,
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
      //this.getComments(this.article[0].id);
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
    helper() {},
    getComments(id) {
      console.log('im here');
      console.log('this.article[0].id', this.article[0].id);
      restApi
        .getArticleComments(id)
        .then(response => {
          this.comments = response;
          return this.comments;
        })
        .catch(err => {
          this.error = err;
        });
    },
    addVote(item) {
      console.log(item.id);
      restApi
        .upvote(item.id)
        .then(response => {
          if (response.upvotes === 1) {
            item.upvotes++;
          } else {
            item.upvotes--;
          }
        })
        .catch(err => {
          this.error = err;
        });
    },
    addComment(comment) {
      restApi
        .addComment(this.article[0].id, comment)
        .then(response => {
          console.log(response);
          return response;
        })
        .catch(err => {
          this.error = err;
        });
      this.getComments(this.article[0].id);
      this.commentsComputed();
    },
  },
};
</script>
<style scoped>
.comment {
  max-width: 70%;
  margin-left: auto;
  margin-right: auto;
}
</style>
