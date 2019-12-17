<template>
  <v-container>
    <v-row>
      <v-col cols="6" v-for="test in $store.state.filteredUserTests">
        <v-card>
          <v-card-title class="primary">
            Test number {{ test.id }}
          </v-card-title>
          <v-list-item v-for="question in test.questions">
            <v-card-text v-for="q in filterQuestions(question)">
              <v-list-item-content>
                <v-list-item-title class="headline">{{
                  q.question
                }}</v-list-item-title>
                <v-card-text v-if="q.choiceTest">
                  <v-list-item-subtitle v-for="answers in q.answers"
                    >{{ answers.answer + ' ' + answers.correct }}
                  </v-list-item-subtitle>
                </v-card-text>
              </v-list-item-content>
            </v-card-text>
          </v-list-item>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from '../../store/store';
export default {
  name: 'Test',
  created() {
    store.dispatch(
      'loadFilteredUserTests',
      this.$route.params.subject.split('=')[1]
    );
  },
  methods: {
    filterQuestions(question) {
      return this.$store.state.allQuestions.filter(a => a.id === question);
    },
  },
};
</script>

<style scoped></style>
