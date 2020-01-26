<template>
  <v-container>
    <v-row>
      <v-checkbox
        v-for="(item, index) in loadArticleTags"
        :key="index"
        :label="item.tag"
        v-model="item.checked"
      />
    </v-row>
    <v-text-field
      :counter="104"
      v-model="article.title"
      label="Title"
      prepend-icon="title"
      required
    />
    <v-text-field
      :counter="104"
      v-model="article.description"
      label="Description shown while browsing articles"
      prepend-icon="description"
      required
    />
    <v-file-input
      v-model="article.image"
      @change="showFile"
      type="file"
      prepend-icon="mdi-camera"
      label="Attach a photo that will show while browsing through articles"
    />
    <!-- <input type="file" accept="image/x-png,image/gif,image/jpeg" @change="showFile">-->
    <img src="" width="150" alt="Thumb preview..." />

    <v-divider></v-divider>
    <editor-floating-menu :editor="editor" v-slot="{ commands, isActive }">
      <div align="center">
        <v-btn
          icon
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
          ><v-icon>format_bold</v-icon></v-btn
        >

        <v-btn
          icon
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
          ><v-icon>format_italic</v-icon></v-btn
        >
        <v-btn
          icon
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
          ><v-icon>format_strikethrough</v-icon></v-btn
        >

        <v-btn
          icon
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
          ><v-icon>format_underlined</v-icon></v-btn
        >

        <v-btn
          icon
          :class="{ 'is-active': isActive.paragraph() }"
          @click="commands.paragraph"
        >
          ><v-icon>format_textdirection_r_to_l</v-icon></v-btn
        >
        <v-btn
          icon
          :class="{ 'is-active': isActive.code() }"
          @click="commands.code"
          ><v-icon>code</v-icon></v-btn
        >
        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </button>
        <v-btn
          icon
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
          ><v-icon>format_list_bulleted</v-icon></v-btn
        >
        <v-btn
          icon
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
          ><v-icon>format_list_numbered</v-icon></v-btn
        >
        <v-btn
          icon
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <v-icon>format_quote</v-icon></v-btn
        >
        <v-btn icon @click="showImagePrompt(commands.image)">
          <v-icon>add_photo_alternate</v-icon></v-btn
        >
        <v-btn icon @click="commands.undo"> <v-icon>undo</v-icon></v-btn>
        <v-btn icon @click="commands.redo"> <v-icon>redo</v-icon></v-btn>
      </div>
    </editor-floating-menu>
    <v-divider></v-divider>
    <editor-content focused outlined :editor="editor" />
    <v-divider></v-divider>

    <v-btn class="primary" dark outlined @click="saveArticle">Save</v-btn>
    <v-container fluid class="ma-10">
      <v-layout row wrap align-center>
        <div v-for="userArticle in loadUserArticles" :key="userArticle.id">
          <v-container class="text-center" fluid>
            <v-row>
              <v-col>
                <v-card class="mx-auto" max-width="400">
                  <v-img
                    :src="articleImg(userArticle.image)"
                    class="white--text align-end"
                    height="200px"
                    dark
                  >
                    <v-card-title> {{ userArticle.title }}! </v-card-title>
                  </v-img>
                  <v-card-text v-if="userArticle.description">
                    {{ userArticle.description.substring(0, 300) + '...' }}
                  </v-card-text>
                  <v-card-actions>
                    <v-dialog
                      v-model="dialog[userArticle.id]"
                      max-width="800px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn outlined small fab v-on="on"
                          ><v-icon>edit</v-icon></v-btn
                        >
                      </template>
                      <v-card>
                        <EditArticle :article="userArticle" />
                      </v-card>
                    </v-dialog>
                    <v-btn icon><v-icon>mdi-thumb-up</v-icon></v-btn>
                    <p>{{ userArticle.upvotes }}</p>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  HardBreak,
  Heading,
  History,
  Image,
  Italic,
  Link,
  ListItem,
  OrderedList,
  Strike,
  TodoItem,
  TodoList,
  Underline,
} from 'tiptap-extensions';
import { restApi } from '../../../../api/restApi';
import EditorFloatingMenu from 'tiptap/src/Components/EditorFloatingMenu';
import EditArticle from './EditArticle';
import { b64toBlob } from '../../../../util/utilFunctions';

export default {
  components: {
    EditArticle,
    EditorMenuBar,
    EditorFloatingMenu,
    EditorContent,
  },
  data() {
    return {
      articleTags: [],
      imageSRC: null,
      article: {
        title: '',
        content: '',
        tags: [],
        image: null,
        description: '',
      },
      dialog: [],
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new BulletList(),
          new Image(),
          new OrderedList(),
          new ListItem(),
          new TodoItem(),
          new TodoList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Link(),
          new Strike(),
          new Underline(),
          new History(),
        ],
        content: `
          <h1>Yay Headlines!</h1>
          <p>All these <strong>cool tags</strong> are working now.</p>
        `,
        onUpdate: ({ getJSON, getHTML }) => {
          this.json = getJSON();
          this.html = getHTML();
        },
      }),
      json: 'Update content to see changes',
      html: 'Update content to see changes',
    };
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  computed: {
    loadArticleTags() {
      return this.$store.state.articleTags;
    },
    checkedTags() {
      return this.loadArticleTags
        .filter(item => item.checked)
        .map(tag => tag.id);
    },
    loadUserArticles() {
      return this.$store.getters.userArticles;
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
    this.$store.dispatch('loadArticleTags');
    this.$store.dispatch('loadUserArticles');
  },
  methods: {
    showFile() {
      let demoImage = document.querySelector('img');
      let file = document.querySelector('input[type=file]').files[0];
      let reader = new FileReader();
      reader.onload = e => {
        demoImage.src = reader.result;
        this.imageSRC = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    showImagePrompt(command) {
      const src = prompt(
        'Enter the url of your image here, or drop it directly into editor'
      );
      if (src !== null) {
        command({ src });
      }
    },
    saveArticle() {
      this.article.content = btoa(this.html);
      this.article.image = btoa(this.imageSRC);
      this.article.tags = this.checkedTags;
      restApi
        .addArticle(this.article)
        .then(response => {
          //this.$store.dispatch('loadUserArticles');
          this.msg = response.msg;
          this.$store.dispatch('loadUserArticles');
          //this.loadUserArticles();
        })
        .catch(err => {
          this.error = err;
        });
    },
  },
};
</script>
