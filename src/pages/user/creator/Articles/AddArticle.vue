<template>
  <v-container>
    <!-- <v-select
              name="tag"
              label="Select tag"
              v-model="tag"
              v-bind:items="$store.state.tags"
              item-value="id"
              @change="filterBySubject"
              class="ma-auto"
              clearable
              return-object
              hide-details
      >
          <template slot="selection" slot-scope="data">
              {{ data.item.name }}, {{ data.item.year }}
          </template>

      </v-select>-->
    <v-text-field
      :counter="104"
      v-model="article.title"
      label="Title"
      required
    ></v-text-field>

    <editor-floating-menu :editor="editor" v-slot="{ commands, isActive }">
      <div class="menubar">
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
    <!--<h3>JSON</h3>
      <pre><code v-html="json"></code></pre>

      <h3>HTML</h3>
      <pre><code>{{ html }}</code></pre>-->
    <editor-content focused outlined :editor="editor" />
    <v-btn class="primary" dark outlined @click="saveArticle">Save</v-btn>
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

export default {
  components: {
    EditorMenuBar,
    EditorFloatingMenu,
    EditorContent,
  },
  data() {
    return {
      article: {
        title: '',
        content: '',
        tags: [],
        image: '',
      },
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
  methods: {
    showImagePrompt(command) {
      const src = prompt('Enter the url of your image here');
      if (src !== null) {
        command({ src });
      }
    },
    saveArticle() {
      this.article.content = btoa(this.html);
      restApi
        .addArticle(this.article)
        .then(response => {
          this.msg = response.msg;
        })
        .catch(err => {
          this.error = err;
        });
    },
  },
};
</script>
