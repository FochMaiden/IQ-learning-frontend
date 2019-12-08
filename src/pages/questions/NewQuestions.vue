<template>
  <v-container>
    <v-col class="flex justify-center ma-auto">
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
      </v-select>
    </v-col>
    <v-data-table
      :headers="headers"
      :items="questions"
      :loading="loading"
      no-data-text="It seems empty here, maybe try adding something"
      class="ma-2 elevation-6"
    >
      <template v-slot:top>
        <v-toolbar-title>Questions</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <div class="flex-grow-1"></div>
        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ on }">
            <v-btn
              rounded
              style="background-image: linear-gradient(to right top, #846be6, #0795ff, #00b4fe, #00cdee, #6be1dd);!important"
              dark
              class="mb-2"
              v-on="on"
              >New Item</v-btn
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
              <v-btn color="red darken-1" rounded text @click="close"
                >Cancel</v-btn
              >
              <v-btn
                style="background-image: linear-gradient(to right top, #846be6, #0795ff, #00b4fe, #00cdee, #6be1dd);!important"
                rounded
                @click="save"
                >Save</v-btn
              >
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
import { restApi } from '../../api/restApi';
import ButtonCounter from '../../templates/QuestionsTemplates/ButtonCounter';

export default {
  name: 'NewQuestions',
  components: { ButtonCounter },
  data() {
    return {
      dialog: false,
      loading: true,
      error: '',
      msg: '',
      questions: [],
      subjects: [],
	    subject: '',
      questionAnswers: [],
      headers: [
        {
          align: 'left',
          sortable: false,
          value: 'name',
        },
        { text: 'question', value: 'question' },
        { text: 'choice question', value: 'choiceTest' },
        { text: 'subject', value: 'subject.name' },
        { text: 'year', value: 'subject.year' },
        { text: 'shareable', value: 'shareable' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        question: '',
        choiceTest: '',
        subject: '',
        year: 0,
        shareable: false,
        id: 0,
      },
      defaultItem: {
        question: '',
        choiceTest: '',
        subject: '',
        year: 1,
        shareable: false,
        id: 0,
      },
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
        	console.log(this.$auth.user())
        	//edit question
          restApi
            .updateQuestion(
              this.editedItem.subject,
              this.editedItem.question,
              this.editedItem.shareable,
              this.editedItem.choiceTest,
              this.editedItem.answers,
              10,
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
  },
};
</script>

<style scoped></style>
