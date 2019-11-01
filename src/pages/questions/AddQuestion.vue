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
              <v-text-field
                name="subject"
                label="Subject"
                id="subject"
                v-model="subject"
                :rules="[required('subject')]"
                filled
              ></v-text-field>
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
              <v-switch v-model="sharable" label="Shareable"></v-switch>
              <v-switch
                v-model="isChoiceTest"
                label="is choice test"
              ></v-switch>
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
    return {
      subject: '',
      question: '',
      sharable: 0,
      isChoiceTest: 0,
      valid: true,
      required,
    };
  },
  methods: {
    addQuestion() {
      console.log(
        this.subject,
        this.sharable,
        this.question,
        this.isChoiceTest
      );
      /* axios
		    .post('/question/add', {data:{subject: 'duoa',
		    question: 'duoa',
		    sherable: 'duoa',
		    isChoiceTest: 'duoa'}})
		    .then(response => {
                console.log(response)
		    })
		    .catch(error => {
			    console.log(error)
		    })*/
      axios.put('http://localhost:8080/question/add', {
        data: {
          subject: this.subject,
          question: this.question,
          sharable: this.sharable,
          isChoiceTest: this.isChoiceTest,
        },
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
