<template>
  <v-container>
    <p>{{ propObj }}</p>
    <p>{{ propObj }}</p>
    <form class="pa-6 primary--text" v-model="valid">
      <v-select
        name="subject"
        label="Subject"
        id="id"
        v-model="subject"
        :items="items"
        item-value="id"
        required
        return-object
      >
        <template slot="selection" slot-scope="data">
          {{ data.item.name }}, {{ data.item.year }}
        </template>
        <template slot="item" slot-scope="data">
          {{ data.item.name }}, {{ data.item.year }}
        </template>
      </v-select>
      <v-row>
        <v-col cols="12" sm="4" md="6">
          <p>{{ editedItem }}</p>
          <v-textarea
            name="question"
            label="Question"
            id="question"
            auto-grow
            rows="1"
            v-model="question"
            :rules="[required('question')]"
          ></v-textarea>
        </v-col>
        <v-col class="flex justify-center ma-auto">
          <v-btn
            v-model="shareable"
            v-on:click="shareable = !shareable"
            color="blue"
            outlined
            small
          >
            <v-icon>
              {{ shareable ? 'mdi-cloud-outline' : ' mdi-cloud-off-outline' }}
            </v-icon>
            &nbsp
            {{ shareable ? 'PUBLIC' : 'PRIVATE' }}
          </v-btn>
          &nbsp;
          <v-btn
            v-model="choiceTest"
            v-on:click="choiceTest = !choiceTest"
            color="primary2"
            outlined
            small
          >
            <v-icon>mdi-baguette</v-icon>
            CHOICE TEST
          </v-btn>
        </v-col>
      </v-row>
      <ButtonCounter
        v-if="choiceTest === true"
        v-on:childToParent="onChildClick"
      ></ButtonCounter>
      <p>{{ error }}</p>
      <v-btn
        large
        dark
        block
        style="background-image: linear-gradient(to right, #fe7676, #f7717e, #ee6d85, #e46a8c, #d96891);"
        :disabled="!valid"
        v-on:click="editQuestion"
        >Update Question</v-btn
      >
    </form>
  </v-container>
</template>

<script>
import { required } from '../../util/validationFunctions.js';
import ButtonCounter from './ButtonCounter';
import { restApi } from '../../api/restApi';

export default {
  components: { ButtonCounter },
  props: {
    propObj: {
      type: Object,
      required: false,
      default: () => {
        return { date: 'chuj', link: '', news: '', subject: 'pabloo', id: 0 };
      },
    },
  },
  data: function() {
    return {
      subject: '',
      id: '',
      owner: '',
      name: '',
      correct: '',
      question: '',
      shareable: false,
      choiceTest: false,
      valid: true,
      error: '',
      msg: '',
      answers: null,
      items: [],
      required,
    };
  },
  mounted() {
    restApi
      .getSubjects()
      .then(response => (this.items = response))
      .catch(err => (this.error = err));
  },
  methods: {
    onChildClick(value) {
      this.rows = value;
    },
    editQuestion() {
      console.log('kupa', this.propObj.question);
      //item.subject, item.question, item.shareable, item.choiceTest, item.answers, item.id
      this.subject = this.propObj.subject;
      this.question = this.propObj.question;
      this.shareable = this.propObj.shareable;
      this.choiceTest = this.propObj.choiceTest;
      this.answers = this.propObj.answers;
      this.owner = 10;
      this.id = this.propObj.id;
      console.log('wiesza kupa', this.id);
      restApi
        .updateQuestion(
          this.subject,
          this.question,
          this.shareable,
          this.choiceTest,
          this.answers,
          this.owner,
          this.propObj.id
        )
        .then(response => {
          this.question = response.q;
          this.msg = response.msg;
        })
        .catch(err => {
          this.error = err;
        });
    },
  },
};
</script>
<style scoped></style>
