<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <v-data-table
      :headers="headers"
      :items="questions"
      :loading="loading"
      :expanded.sync="expanded"
      v-model="selected"
      show-expand
      show-select
      no-data-text="It seems empty here, maybe try adding something"
    >
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title color="primary">Questions</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-select
            name="subject"
            label="Select subject"
            v-model="subject"
            :items="subjects"
            item-value="id"
            @change="filterBySubject"
            class="ma-auto"
            return-object
            hide-details
          >
            <template slot="selection" slot-scope="data">
              {{ data.item.name }}, {{ data.item.year }}
            </template>
            <template slot="item" slot-scope="data">
              {{ data.item.name }} year {{ data.item.year }}
            </template>
          </v-select>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-switch
            v-model="seePublic"
            label="Show public questions"
            v-on:change="getQuestions"
            hide-details
          ></v-switch>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-dialog v-model="dialog" max-width="800px">
            <template v-slot:activator="{ on }">
              <v-btn outlined small fab v-on="on"
                ><v-icon>mdi-plus</v-icon></v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }} </span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <p>{{ msg }}</p>
                  <form class="pa-6 primary--text">
                    <v-select
                      name="subject"
                      label="Subject"
                      id="id"
                      v-model="editedItem.subject"
                      :items="subjects"
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
                          v-model="editedItem.question"
                          :rules="[required('question')]"
                        ></v-textarea>
                      </v-col>
                      <v-col class="flex justify-center ma-auto">
                        <v-btn
                          v-model="editedItem.shareable"
                          v-on:click="
                            editedItem.shareable = !editedItem.shareable
                          "
                          color="blue"
                          outlined
                          small
                        >
                          <v-icon>
                            {{
                              editedItem.shareable
                                ? 'mdi-cloud-outline'
                                : ' mdi-cloud-off-outline'
                            }}
                          </v-icon>
                          &nbsp
                          {{ editedItem.shareable ? 'PUBLIC' : 'PRIVATE' }}
                        </v-btn>
                        &nbsp;
                        <v-btn
                          v-model="editedItem.choiceTest"
                          v-on:click="
                            editedItem.choiceTest = !editedItem.choiceTest
                          "
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
                      v-if="editedItem.choiceTest === true"
                      :rows="editedItem.answers"
                      v-on:childToParent="onChildClick"
                    ></ButtonCounter>
                    <p>{{ error }}</p>
                  </form>
                </v-container>
              </v-card-text>
              <v-card-text>{{ error }}</v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="red" outlined @click="close">Cancel</v-btn>
                <v-btn class="primary" dark outlined @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.data-table-expand="{ item, isExpanded, expand }">
        <v-icon
          small
          color="primary"
          @click="expand(true)"
          v-if="item.choiceTest && !isExpanded"
          >mdi-chevron-down</v-icon
        >
        <v-icon
          small
          color="primary"
          @click="expand(false)"
          v-if="item.choiceTest && isExpanded"
          >mdi-chevron-up</v-icon
        >
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-list-item
            class="ma-auto d-inline"
            v-for="(answer, index) in item.answers"
          >
            {{ index + 1 }}. {{ answer.answer }}
            <v-icon small :color="answer.correct ? 'green' : 'red'">{{
              answer.correct ? 'mdi-check' : 'mdi-block-helper'
            }}</v-icon>
          </v-list-item>
        </td>
      </template>
      <!--      <template v-slot:item.data-table-select="{ isSelected, select }">
        <v-simple-checkbox :value="isSelected" @input="select($event)"></v-simple-checkbox>
      </template>-->
      <template v-slot:item.shareable="{ item }">
        <v-icon>
          {{ item.shareable ? 'mdi-cloud-outline' : 'mdi-cloud-off-outline' }}
        </v-icon>
      </template>
      <template v-slot:item.choiceTest="{ item }">
        <v-icon>
          {{ item.choiceTest ? 'mdi-playlist-check' : 'mdi-playlist-minus' }}
        </v-icon>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
          v-if="$auth.user().id === item.owner"
          small
          color="secondary"
          class="mr-2"
          @click="editItem(item)"
        >
          edit
        </v-icon>
        <v-icon
          v-if="$auth.user().id === item.owner"
          small
          color="red"
          @click="deleteItem(item)"
        >
          delete
        </v-icon>
      </template>
      <template v-slot:footer="{ headers }">
        <v-divider class="mb-4" horizontal></v-divider>
        <v-dialog v-model="testDialog" max-width="800px">
          <template v-slot:activator="{ on }">
            <v-btn class="flex ma-auto" outlined small v-on="on"
              ><v-icon>mdi-plus</v-icon>Create test from selection</v-btn
            ></template
          > <v-card>
          <v-card-title>
            Test
          </v-card-title>
          <v-card-text>
            <v-col v-for='question in selected'>
              {{question}}
            </v-col>
          </v-card-text>
          <v-btn color="red" outlined @click="testDialog=false">Cancel</v-btn>
          <v-btn class="primary" dark outlined @click="addTest">Save</v-btn>
        </v-card>
        </v-dialog>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { required } from '../../util/validationFunctions';
import { restApi } from '../../api/restApi';
import ButtonCounter from '../../templates/QuestionsTemplates/ButtonCounter';
import { merge } from '../../util/utilFunctions';
import { questionsHeaders } from '../../util/headers';

export default {
  name: 'NewQuestions',
  components: { ButtonCounter },
  data() {
    return {
      dialog: false,
      testDialog:false,
      seePublic: false,
      loading: true,
      error: '',
      msg: '',
      questions: [],
      publicQuestions: [],
      subjects: [],
      subject: '',
      questionAnswers: [],
      expanded: [],
      selected: [],
      headers: questionsHeaders,
      editedIndex: -1,
      editedItem: {
        id: 0,
        question: '',
        choiceTest: '',
        subject: '',
        year: 0,
        shareable: false,
      },
      defaultItem: {
        id: 0,
        question: '',
        choiceTest: '',
        subject: '',
        year: 1,
        shareable: false,
      },
      required,
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Add question' : 'Edit question';
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.getQuestions();
    this.getAllSubjects();
  },
  methods: {
    onChildClick(value) {
      this.questionAnswers = value;
    },
    getAllSubjects() {
      restApi
        .getSubjects()
        .then(response => (this.subjects = response))
        .catch(err => (this.error = err));
    },
    filterBySubject() {
      restApi
        .filterQuestionsForUserBySubject(this.subject.id)
        .then(response => (this.questions = response))
        .catch(err => (this.error = err));
    },
    getQuestions() {
      if (this.seePublic) {
        restApi
          .getPublicQuestions()
          .then(response => {
            let tempQ = this.questions;
            this.questions = merge(tempQ, response, 'id');
          })
          .catch(err => (this.error = err));
      } else this.getUserQuestions();
    },
    getUserQuestions() {
      restApi
        .getUserQuestions()
        .then(response => {
          this.loading = false;
          if (response === 'Question list empty') {
            this.questions = [];
          } else this.questions = response;
          //console.log(response);
        })
        .catch(err => (this.error = err));
    },
    editItem(item) {
      this.editedIndex = this.questions.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      restApi
        .removeQuestion(item.id)
        .then(response => this.getQuestions())
        .catch(err => {
          this.error = err;
        });
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
      this.error = '';
    },
    save() {
      if (this.editedItem.questions !== '') {
        if (this.editedIndex === -1) {
          // add new question
          restApi
            .addQuestion(
              this.editedItem.subject,
              this.editedItem.question,
              this.editedItem.shareable,
              this.editedItem.choiceTest,
              this.questionAnswers
            )
            .then(response => {
              this.getQuestions();
              this.msg = response.msg;
            })
            .catch(err => {
              this.error = err;
            });
          this.close();
        } else {
          //edit question
          restApi
            .updateQuestion(
              this.editedItem.subject,
              this.editedItem.question,
              this.editedItem.shareable,
              this.editedItem.choiceTest,
              this.questionAnswers,
              this.editedItem.id
            )
            .then(response => {
              this.getQuestions();
              this.msg = response.msg;
            })
            .catch(err => {
              this.error = err;
            });
          this.close();
        }
      } else this.error = `Can't b empti`;
    },
    addTest() {
      let questionIds = [];
      this.selected.forEach(item => {
        questionIds.push(item.id);
      });
      restApi.addTest(this.subject.id, true, questionIds);
    },
  },
};
</script>

<style scoped></style>
