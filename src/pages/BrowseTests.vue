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
      <v-col cols="6" md="6" sm="12" v-for="test in tests">
        <v-card>
          <v-card-title>
            <span class="headline">{{ testTitle(test.id, test.title) }}</span>
            <v-spacer></v-spacer>
            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-btn
                  outlined
                  color="info"
                  :disabled="test.owner === $auth.user().id"
                  @click="conversationExists(test.owner)"
                  v-on="on"
                >
                  CHAT &nbsp;
                  <v-icon class="ma-auto ">mdi-chat</v-icon>
                </v-btn>
              </template>
              <v-card class="pa-4">
                <div v-if="!isConvo">
                  <v-text-field dense v-model="msg"></v-text-field>
                  <v-btn color="primary" @click="startConversation(test.owner)"
                    >SENT</v-btn
                  >
                </div>
                <div v-else>
                  You already have chat with that user!
                  <v-btn to="/user/chat" outlined small> Go to chat </v-btn>
                </div>
              </v-card>
            </v-menu>

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
import { restApi } from '../api/restApi';
import { dwnld } from '../util/utilFunctions';
import { stompClientSocket } from '../api/wsApi';

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
      msg: null,
      isConvo: false,
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
    testTitle() {
      return function(id, title) {
        if (title) {
          return title;
        } else return 'Test number ' + id;
      };
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
    conversationExists(owner) {
      if (this.$auth.user().conversations) {
        Object.values(this.$auth.user().conversations).map(o => {
          this.isConvo = o.id === owner;
        });
      } else this.isConvo = false;
    },
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
    startConversation(owner) {
        stompClientSocket.startConversation(
          this.msg,
          owner,
          this.$auth.user().id
        );

  },
};
</script>

<style scoped></style>
