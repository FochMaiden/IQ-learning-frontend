<template>
  <v-container>
    <v-row>
      <v-col cols="6" v-for="test in $store.state.filteredUserTests">
        <v-card>
          <v-card-title> Test number {{ test.id }} </v-card-title>
          <v-list-item v-for="question in test.questions">
            <v-list-item-content>
              <v-list-item-title class="headline">{{
                question.question
              }}</v-list-item-title>
              <v-card-text v-if="question.choiceTest">
                <v-list-item-subtitle
                  v-for="answers in question.answers"
                  class="pa-2 d-inline"
                >
                  {{ answers.answer }}
                  <v-icon small :color="answers.correct ? 'green' : 'red'">
                    {{ answers.correct ? 'mdi-check' : 'mdi-block-helper' }}
                  </v-icon>
                </v-list-item-subtitle>
              </v-card-text>
            </v-list-item-content>
            <v-btn
              v-if="editing"
              v-on:click="removeQuestion(question.id)"
              color="red"
              outlined
              fab
              x-small
            >
              <v-icon>mdi-delete-empty</v-icon>
            </v-btn>
          </v-list-item>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-on:click="isEditing" color="blue" outlined fab small>
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn
              v-on:click="removeTest(test.id)"
              color="red"
              outlined
              fab
              small
            >
              <v-icon>mdi-delete-empty</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from '../../../store/store';
import { restApi } from '../../../api/restApi';

export default {
  name: 'Test',
  created() {
    store.dispatch(
      'loadFilteredUserTests',
      this.$route.params.subject.split('=')[1]
    );
  },
  data() {
    return {
      editing: false,
    };
  },
  methods: {
    isEditing() {
      this.editing = !this.editing;
    },
    removeTest(id) {
      restApi.removeTest(id).then(response => {
        store.dispatch(
          'loadFilteredUserTests',
          this.$route.params.subject.split('=')[1]
        );
      });
    },
    removeQuestion(id) {
      console.log(id);
    },
  },
};
</script>

<style scoped></style>
