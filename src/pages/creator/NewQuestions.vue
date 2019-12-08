<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="questions"
      :loading="loading"
      no-data-text="It seems empty here, maybe try adding something"
      class="pa-6 ma-2 elevation-1"
    >
      <template v-slot:top>
        <v-toolbar-title>Questions</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-row>
          <v-col>
            <v-select
              name="subject"
              label="Filter by subject"
              id="id"
              v-model="subject"
              :items="subjects"
              item-value="id"
              @change="filterBySubject"
              return-object
            >
              <template slot="selection" slot-scope="data">
                {{ data.item.name }}, {{ data.item.year }}
              </template>
              <template slot="item" slot-scope="data">
                {{ data.item.name }} year {{ data.item.year }}
              </template>
            </v-select></v-col
          >
          <v-col>
            <v-switch
              v-model="seePublic"
              label="Show public questions"
              class="pa-3"
            ></v-switch
          ></v-col>
        </v-row>
        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" v-on="on">New Item</v-btn>
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
              <v-btn color="red" rounded text @click="close">Cancel</v-btn>
              <v-btn class="primary" rounded @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:item.shareable="{ item }">
        <v-icon>
          {{
            item.shareable
              ? 'mdi-checkbox-marked'
              : 'mdi-checkbox-blank-outline'
          }}
        </v-icon>
      </template>
      <template v-slot:item.choiceTest="{ item }">
        <v-icon>
          {{
            item.choiceTest
              ? 'mdi-checkbox-marked'
              : 'mdi-checkbox-blank-outline'
          }}
        </v-icon>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          edit
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { required } from '../../util/validationFunctions';
import { restApi } from '../../api/restApi';
import ButtonCounter from '../../templates/QuestionsTemplates/ButtonCounter';

export default {
  name: 'NewQuestions',
  components: { ButtonCounter },
  data() {
    return {
      dialog: false,
      seePublic: false,
      loading: true,
      error: '',
      msg: '',
      questions: [],
      publicQuestions: [],
      subjects: [],
      subject: '',
      questionAnswers: [],
      headers: [
        {
          align: 'left',
          sortable: false,
          value: 'name',
        },
        { text: 'Question', value: 'question' },
        { text: 'Subject', value: 'subject.name' },
        { text: 'Year', value: 'subject.year' },
        { text: 'Choice question', value: 'choiceTest' },
        { text: 'Shareable', value: 'shareable' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        question: '',
        choiceTest: '',
        subject: '',
        owner: 0,
        year: 0,
        shareable: false,
      },
      defaultItem: {
        id: 0,
        question: '',
        choiceTest: '',
        subject: '',
        year: 1,
        owner: 0,
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
    this.getUserQuestions();
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
        .then(response => this.getUserQuestions())
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
              this.getUserQuestions();
              this.msg = response.msg;
            })
            .catch(err => {
              this.error = err;
            });
          this.close();
        } else {
          //edit question
          console.log(this.editedItem);
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
              this.getUserQuestions();
              this.msg = response.msg;
            })
            .catch(err => {
              this.error = err;
            });
          this.close();
        }
      } else this.error = `Can't b empti`;
    },
  },
};
</script>

<style scoped></style>
