<template>
  <v-container>
    <v-row>
      <v-col cols="6" v-for="test in tests">
        <v-card>
          <v-card-title>
            <span class="headline">Test number {{ test.id }}</span>
            <v-spacer></v-spacer>
            <v-menu right :offset-x="offset">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-col>
                  <v-btn
                    v-on:click="isEditing(test)"
                    color="blue"
                    outlined
                    small
                  >
                    Edit
                    <v-icon>mdi-pencil-outline</v-icon>
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    v-on:click="removeTest(test.id)"
                    color="red"
                    outlined
                    small
                    >Delete
                    <v-icon>mdi-delete-empty</v-icon>
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    v-on:click="addResults(test.id)"
                    color="secondary"
                    outlined
                    small
                    >add results
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
              </v-card>
            </v-menu>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-row>
            <v-list-item v-for="(question, index) in test.questions">
              <v-list-item-content>
                <v-list-item-title class="headline text-wrap">
                  {{ index + 1 }}
                  &nbsp;
                  {{ question.question }}
                  <v-btn
                          v-if="isEditedTest(test.id)"
                          @click="removeQuestion(question.id)"
                          color="red"
                          outlined
                          fab
                          x-small
                  >
                    <v-icon>mdi-delete-empty</v-icon>
                  </v-btn>
                </v-list-item-title>
                <v-card-text v-if="question.choiceTest">
                  <v-list-item-subtitle v-for="answers in question.answers">
                    <v-col cols="12" sm="6" md="3">
                      <v-icon small :color="answers.correct ? 'green' : 'red'">
                        {{ answers.correct ? 'mdi-check' : 'mdi-block-helper' }}
                      </v-icon>
                      {{ answers.answer }}
                    </v-col>
                  </v-list-item-subtitle>
                </v-card-text>
              </v-list-item-content>
              <v-col cols="12" sm="6" md="3">
                <v-text-field label="points" dense solo/>
              </v-col>
            </v-list-item>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from '../../../../store/store';
import { restApi } from '../../../../api/restApi';

export default {
  name: 'Test',
  created() {
    this.getTests();
  },
  computed: {
    tests() {
      if (this.route === 'all') return this.$store.state.userTests;
      else return this.$store.state.filteredUserTests;
    },
    route() {
      return this.$route.params.subject.split('=')[1];
    },
  },
  data() {
    return {
      editedTest: null,
      offset: true,
    };
  },
  methods: {
    getTests() {
      if (this.route === 'all') {
        store.dispatch('loadUserTests');
      } else
        store.dispatch(
          'loadFilteredUserTests',
          this.$route.params.subject.split('=')[1]
        );
    },
    isEditing(test) {
      if (test === this.editedTest) {
        return (this.editedTest = null);
      } else this.editedTest = test;
    },
    isEditedTest(id) {
      if (this.editedTest && id) {
        return this.editedTest.id === id;
      } else return false;
    },
    removeTest(id) {
      restApi.removeTest(id).then(response => {
        this.getTests();
      });
    },
    removeQuestion(id) {
      let questions = this.editedTest.questions.map(o => o.id);
      questions = questions.filter(o => o !== id);
      restApi.editTest(this.editedTest, questions).then(response => {
        this.editedTest = null;
        this.getTests();
      });
    },
  },
};
</script>

<style scoped></style>
