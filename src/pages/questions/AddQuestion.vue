<template>
  <v-container>
    <p>{{ msg }}</p>
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
        v-on:click="addQuestion"
        >Add Question</v-btn
      >
    </form>
  </v-container>
</template>

<script>
import { required } from '../../util/validationFunctions.js';
import axios from 'axios';
import ButtonCounter from './ButtonCounter';
import { restApi } from '../../api/restApi';

export default {
  components: { ButtonCounter },
  data: function() {
    return {
      subject: '',
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
    restApi.getSubjects().then(response => (this.items = response)).catch(err=>this.error = err);
  },
  methods: {
    onChildClick(value) {
      this.rows = value;
    },
    addQuestion() {
      axios.put('/question/add', {
        subject: this.subject,
        question: this.question,
        shareable: this.shareable,
        choiceTest: this.choiceTest,
        answers: this.rows,
        success: async function(response) {
          this.question(response.data);
          this.msg = 'Question added';
        },
        error: function(err) {
          if (err.response.data) {
            this.error = err.response.data.error;
          }
        },
      });
      //console.log(this.rows[0].answerValue);
    },
  },
};
</script>
<style scoped></style>
