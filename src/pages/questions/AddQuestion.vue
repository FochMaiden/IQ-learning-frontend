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
            </v-flex>
          </v-layout>
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

export default {
  data: function() {
    let math1;
    let math2;
    return {
      subject: '',
      question: '',
      shareable: false,
      choiceTest: false,
      valid: true,
      items: [
        (math1 = { id: 2, name: 'Math', year: 2 }),
        (math2 = { id: 2, name: 'Math', year: 2 }),
      ],
      required,
    };
  },
  methods: {
    addQuestion() {
      /*axios
		    .put('/question/add', {
				    subject: this.subject,
				    question: this.question,
				    shareable: this.shareable,
				    choiceTest: this.choiceTest})
		    .then(response => {
			    this.question(response.data);
		    })
		    .catch(err => {
			    this.err = err.response.data;
		    })*/
      axios.put('http://localhost:8080/question/add', {
        subject: this.subject,
        question: this.question,
        shareable: this.shareable,
        choiceTest: this.choiceTest,
        success: async function(response) {
          this.question(response.data);
        },
        error: function(err) {
          if (err.response.data) {
            this.error = err.response.data;
          }
        },
      });
    },
  },
};
</script>
<style scoped></style>
