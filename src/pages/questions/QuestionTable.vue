<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <p>{{ error }}</p>
    <v-select
      name="subject"
      label="Subject"
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
    <v-dialog v-model="dialog" max-width="600" overlay-opacity="0.2">
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

    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="questions"
      :items-per-page="5"
      class="elevation-1"
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
    </v-data-table></v-container
  >
</template>

<script>
import AddQuestion from './AddQuestion';
import axios from 'axios';

export default {
  components: { AddQuestion },
  data() {
    return {
      subject: '',
      dialog: false,
      questions: [],
      loading: true,
      subjects: [],
      error: '',
      headers: [
        {
          text: 'Questions',
          align: 'left',
          sortable: false,
          value: 'name',
        },
        { text: 'question', value: 'question' },
        { text: 'choice question', value: 'choiceTest' },
        { text: 'subject', value: 'subject.name' },
        { text: 'year', value: 'subject.year' },
        { text: 'shareable', value: 'shareable' },
      ],
    };
  },
  mounted() {
    axios
      .get('/question/get/user')
      .then(response => {
        //console.log(response.data);
        this.loading = false;
        this.questions = response.data;
        return response.data;
      })
      .catch(err => {
        this.error = err.response;
        console.log(err);
      });
    axios
      .get('/subject/get')
      .then(response => {
        this.subjects = response.data;
        return response.data;
      })
      .catch(err => {
        this.error = err.response.data;
        console.log(err);
      });
  },
  methods: {
    filterBySubject() {
      let url1 = '/question/get/subject/';
      let id = this.subject.id;
      let url = url1.concat(id);
      axios
        .get(url)
        .then(response => {
          console.log(this.subject.id);
          this.error = null;
          this.questions = response.data;
          return response.data;
        })
        .catch(err => {
          this.error = err.response.data;
          console.log(err);
        });
    },
  },
};
</script>
