<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <v-row>
      <v-col cols="12" sm="4" md="6">
        <v-dialog v-model="dialog" max-width="800" overlay-opacity="0.6">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" v-on="on">Add Question</v-btn>
          </template>
          <v-card>
            <v-toolbar>
              <v-toolbar-title>Add Question</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark text @click="dialog = false">Save</v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <AddQuestion></AddQuestion>
          </v-card>
        </v-dialog>
      </v-col>
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
    </v-row>
    <p>{{ error }}</p>

    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="questions"
      :items-per-page="5"
      class="elevation-1"
      v-model="selected"
    >
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
      <!-- <template  slot="item.actions" slot-scope="questions">
            <v-btn

                    v-on:click="removeQuestion"
                    color="red"
                    outlined
                    fab
                    small
            >
                <v-icon>mdi-delete-empty</v-icon>
            </v-btn>
</template>-->
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editQuestion(item)">
          edit
        </v-icon>
        <v-icon small @click="removeQuestion(item)">
          mdi-delete-empty
        </v-icon>
      </template>
    </v-data-table></v-container
  >
</template>

<script>
import AddQuestion from '../../templates/QuestionsTemplates/AddQuestion';
import { restApi } from '../../api/restApi';

export default {
  components: { AddQuestion },
  data() {
    return {
      selected: [],
      subject: '',
      dialog: false,
      questions: [],
      loading: true,
      subjects: [],
      error: '',
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
    };
  },
  created() {
    this.getQuestions();
    this.getAllSubjects();
  },
  methods: {
    getAllSubjects() {
      restApi
        .getSubjects()
        .then(response => (this.subjects = response))
        .catch(err => (this.error = err));
    },
    filterBySubject() {
      restApi
        .filterQuestionsBySubject(this.subject.id)
        .then(response => (this.questions = response))
        .catch(err => (this.error = err));
    },
    getQuestions() {
      restApi
        .getUserQuestions()
        .then(response => {
          this.loading = false;
          this.questions = response;
          console.log(response);
        })
        .catch(err => (this.error = err));
    },
    removeQuestion(item) {
      console.log('item', item);
      console.log('item.id', item.id);
      restApi
        .removeQuestion(item.id)
        .then(response => this.getQuestions())
        .catch(err => {
          this.error = err;
        });
    },
  },
};
</script>
