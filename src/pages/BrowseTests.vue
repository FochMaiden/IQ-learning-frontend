<template>
  <v-container>
    <v-combobox
      label="Subjects"
      v-model="selectedSubjects"
      :items="$store.getters.subjects"
      chips
      item-value="id"
      return-object
      prepend-icon="filter_list"
      solo
      multiple
    >
      <template slot="selection" slot-scope="data">
        {{ data.item.name }}, {{ data.item.year }}
      </template>
      <template slot="item" slot-scope="data">
        {{ data.item.name }}, {{ data.item.year }}
      </template>
      <template v-slot:selection="{ attrs, item, select, selected }">
        <v-chip
          v-bind="attrs"
          :input-value="selected"
          close
          @click="select"
          @click:close="remove(item)"
        >
          <strong>{{ item.name }}</strong
          >&nbsp;
          <span>year {{ item.year }}</span>
        </v-chip>
      </template>
    </v-combobox>
    <v-row>
      <!--   <v-col cols="6" v-for="test in tests">
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
          </v-list-item>
        </v-card>
      </v-col>-->
      <v-col cols="6" md="6" sm="12" v-for="test in tests">
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
                  <v-btn v-on:click="downloadTest(test.id)" outlined small
                    >Download
                    <v-icon>mdi-download-outline</v-icon>
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    v-on:click="addResults(test)"
                    color="secondary"
                    outlined
                    small
                    >Add results
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
	import {restApi} from '../api/restApi';
	import {dwnld} from '../util/utilFunctions';

	export default {
  name: 'BrowseTests',
  created() {
    this.$store.dispatch('loadPublicTests');
  },
  data() {
    return {
      selectedSubjects: null,
      points: {},
      resultsTestId: null,
      loadingResults: false,
      offset: true,
    };
  },
  computed: {
    tests() {
      if (this.selectedSubjects) {
        let ids = this.selectedSubjects.map(item => {
          return item.id;
        });
        this.$store.commit('filterPublicTests', ids);
        return this.$store.getters.filteredPublicTests;
      } else return this.$store.getters.publicTests;
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
  methods: {
    remove(item) {
      if (this.selectedSubjects.length === 1) {
        this.selectedSubjects = null;
      } else {
        this.selectedSubjects.splice(this.selectedSubjects.indexOf(item), 1);
        this.selectedSubjects = [...this.selectedSubjects];
      }
    },
    downloadTest(id) {
      console.log('hello');
      restApi.downloadTest(id, 2).then(response => {
        dwnld(response, id);
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
  },
};
</script>

<style scoped></style>
