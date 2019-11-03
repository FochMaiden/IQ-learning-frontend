<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h4>Create a new Question</h4>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form class="pt-6 px-6 primary--text" v-model="valid">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-select
                name="subject"
                label="Subject"
                id="subject"
                v-model="subject"
                :rules="[required('subject')]"
                :items="items"
                required
              ></v-select>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="question"
                label="Question"
                id="question"
                multi-line
                filled
                v-model="question"
                :rules="[required('question')]"
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-switch v-model="shareable" label="Shareable"></v-switch>
              <v-switch v-model="choiceTest" label="is choice test"></v-switch>
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                  <v-text-field
                    v-if="choiceTest === true"
                    name="answer"
                    label="Answer"
                    id="answer"
                    multi-line
                    filled
                    v-model="answer"
                    :rules="[required('question')]"
                  ></v-text-field>
                  <v-text-field
                    v-if="choiceTest === true"
                    name="answer1"
                    label="Answer 2"
                    id="answer1"
                    multi-line
                    filled
                    v-model="answer1"
                    :rules="[required('question')]"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <p>{{ error }}</p>
          <ButtonCounter></ButtonCounter>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn
                large
                dark
                block
                style="background-image: linear-gradient(to right, #fe7676, #f7717e, #ee6d85, #e46a8c, #d96891);"
                :disabled="!valid"
                v-on:click="addQuestion"
                >Add Question</v-btn
              >
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { required } from '../../util/validationFunctions.js';
import axios from 'axios';
import ButtonCounter from './ButtonCounter';

export default {
  components: { ButtonCounter },
  data: function() {
    let math1;
    let math2;
    return {
      subject: '',
      question: '',
      shareable: false,
      choiceTest: false,
      valid: true,
      error: '',
      items: [
        (math1 = { id: 2, name: 'Math', year: 2 }),
        (math2 = { id: 2, name: 'Math', year: 2 }),
      ],
      required,
    };
  },
  methods: {
    addQuestion() {
      /* axios
		    .put('/question/add', {
				    subject: this.subject,
				    question: this.question,
				    shareable: this.shareable,
				    choiceTest: this.choiceTest,
            answer: this.answer,
            answer1: this.answer1})
		    .then(response => {
			    this.question(response.data);
			    this.error= (response.data.message)
		    })
		    .catch(err => {
			    this.error = err.response.data.error;
		    })*/
      axios.put('http://localhost:8080/question/add', {
        subject: this.subject,
        question: this.question,
        shareable: this.shareable,
        choiceTest: this.choiceTest,
        answer: this.answer,
        answer1: this.answer1,
        success: async function(response) {
          this.question(response.data);
        },
        error: function(err) {
          if (err.response.data) {
            this.error = err.response.data.error;
          }
        },
      });
    },
  },
};
</script>
<style scoped></style>
