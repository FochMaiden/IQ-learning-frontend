<template>
  <v-container>
    <v-row>
      <v-col cols="6" md="6" sm="12" v-for="test in tests">
        <v-card>
          <v-card-title>
            <span class="headline">Test number {{ test.id }}</span>
            <v-col>
              <v-btn
                v-on:click="addResults(test)"
                color="secondary"
                outlined
                small
                >add results
              </v-btn>
            </v-col>
            <!--            <v-col>
              <v-btn
                v-on:click="seeResults(test.id, test.questions)"
                color="green"
                outlined
                small
                >See results
              </v-btn>
            </v-col>-->
            <v-menu right :offset-x="offset">
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-col>
                  <v-btn v-on:click="downloadTest(test.id)" outlined small
                    >Download
                    <v-icon>mdi-download-outline</v-icon>
                  </v-btn>
                </v-col>
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
              </v-card>
            </v-menu>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-row>
            <v-list-item v-for="(question, index) in test.questions">
              <v-list-item-content>
                <v-list-item-title class="headline text-wrap">
                  {{ index + 1 }}. &nbsp;
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
                  <v-list-item-subtitle v-for="answer in question.answers">
                    <v-col cols="12" sm="6" md="3">
                      <v-icon small :color="answer.correct ? 'green' : 'red'">
                        {{ answer.correct ? 'mdi-check' : 'mdi-block-helper' }}
                      </v-icon>
                      {{ answer.answer }}
                    </v-col>
                  </v-list-item-subtitle>
                </v-card-text>
              </v-list-item-content>
              <v-col cols="4" sm="2" md="2">
                <v-select
                  v-if="isAddingResults(test.id)"
                  hide-details
                  dense
                  solo
                  v-model="points[question.id]"
                  :items="items(question.correctAnswers)"
                />
              </v-col>
            </v-list-item>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-if="isAddingResults(test.id)"
              outlined
              color="primary"
              :loading="loadingResults"
              @click="addResults(test)"
              >cancel</v-btn
            >
            <v-btn
              v-if="isAddingResults(test.id)"
              color="primary"
              :loading="loadingResults"
              @click="saveResults"
              >save results</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import {restApi} from '../../../../api/restApi';
  import {dwnld} from '../../../../util/utilFunctions';

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
    items() {
      return function(q) {
        if (q === 0) {
          return [0, 1];
        }
        let list = [];
        for (let i = 0; i <= q; i++) {
          list.push(i);
        }
        return list;
      };
    },
  },
  data() {
    return {
      points: {},
      resultsTestId: null,
      loadingResults: false,
      editedTest: null,
      offset: true,
    };
  },
  methods: {
    getTests() {
      if (this.route === 'all') {
        this.$store.dispatch('loadUserTests');
      } else
        this.$store.dispatch(
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
    downloadTest(id) {
      restApi.downloadTest(id, 2).then(response => {
        dwnld(response, id);
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
    addResults(test) {
      if (test.id === this.resultsTestId) {
        return (this.resultsTestId = null);
      } else this.resultsTestId = test.id;
    },
    isAddingResults(id) {
      if (this.resultsTestId && id) {
        return this.resultsTestId === id;
      } else return false;
    },
    saveResults() {
      this.loadingResults = true;
      let results = [];
      for (let [key, value] of Object.entries(this.points)) {
        results = [
          ...results,
          {
            questionId: key,
            points: value,
          },
        ];
      }
      restApi.addResultsForTest(this.resultsTestId, results).then(response => {
        this.resultsTestId = null;
        this.points = {};
        this.loadingResults = false;
        this.$store.dispatch('loadLastResults');
      });
    },
    seeResults(id, questions) {
      for (const question of questions) {
        restApi.getResultsForQuestion(question.id).then(response => {
          this.$store.commit('setQuestionResults', response);
        });
      }
      /*      restApi.getResultsForTest(id).then(response => {
        this.$store.commit('setTestResults', response);
      });*/
    },
  },
};
</script>

<style scoped></style>
