<template>
  <v-container fluid class="mx-auto mt-12">
    <v-layout row wrap align-center mb-5>
      <v-card max-width="100%" class="mx-auto">
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
          <v-menu v-if="$auth.user()" :close-on-content-click="false">
            <template v-slot:activator="{ on }">
              <v-icon :disabled="isDisabledChat" v-on="on" class="ma-auto "
                >mdi-chat</v-icon
              >
            </template>
            <v-card
              ><v-text-field dense v-model="msg"></v-text-field>
              <v-btn @click="startConversation">send</v-btn></v-card
            >
          </v-menu>
        </v-list-item>

        <v-img
          :src="articleImg(article[0].image)"
          class="white--text align-end"
          height="100%"
          dark
        ></v-img>

        <v-card-text>
          <div v-html="articleContent(article[0].content)"></div>
        </v-card-text>
        <span class="d-flex justify-end ma-5"
          ><v-btn
            :disabled="isDisabled"
            icon
            @click="addVoteArticle(article[0])"
            ><v-icon>mdi-thumb-up</v-icon
            ><span class="float-right ml-2">{{
              article[0].upvotes
            }}</span></v-btn
          ></span
        >
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
          ><v-btn :disabled="isDisabled" icon @click="addVote(comment)"
            ><v-icon>mdi-thumb-up</v-icon
            ><span class="float-right ml-2">{{ comment.upvotes }}</span></v-btn
          ></span
        >
      </div>
    </v-card>
    <v-card v-if="$auth.user().id" class=" pa-2 mb-1 comment">
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
      <!-- <span>{{added}}</span>-->
      <span class="d-flex justify-end"
        ><v-btn primary outlined small fab icon @click="addComment(comment)"
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
  import {stompClientSocket} from '../api/wsApi';

  export default {
  data() {
    return {
      msg: null,
      article: [],
      added: '',
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
      return this.comments;
    },
    isDisabled: function() {
      return !this.$auth.user().id;
    },
    isDisabledChat() {
      if (this.$auth.user().hasOwnProperty('id')) {
        return this.article[0].owner.id === this.$auth.user().id;
      } else return true;
    },
    articleImg() {
      return function(imga) {
        if (imga) {
          let blep = atob(imga);
          let blop = b64toBlob(blep, 'image/png');
          let image = new Image();
          image.src = URL.createObjectURL(blop);

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
    this.fetchData();
  },
  methods: {
    getComments(id) {
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
    addVoteArticle(item) {
      restApi
        .upvoteArticle(item.id)
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
          this.getComments(this.article[0].id);
          this.comment = '';
          return response;
        })
        .catch(err => {
          this.error = err;
        });
    },
    fetchData() {
      this.urlId = this.$route.params.id;
      console.log(`urlID`, this.urlId);
      this.article = this.$store.state.articles.filter(item => {
        return item.id.toString() === this.urlId;
      });
      this.getComments(this.article[0].id);
    },
    startConversation() {
      /*      if (this.$auth.user() && this.$auth.user().conversations){
        let convos = this.$auth.user().conversations
        console.log(this.$auth.user())
      }*/
      stompClientSocket.startConversation(
        this.msg,
        this.article[0].owner.id,
        this.$auth.user().id
      );
    },
    /*clearAdded(){
    	this.added=''
      }*/
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
