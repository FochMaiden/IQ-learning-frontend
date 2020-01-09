<template>
  <v-container>
    <v-toolbar dense floating>
      <v-text-field
        hide-details
        prepend-icon="search"
        single-line
      ></v-text-field>
    </v-toolbar>
    <v-row>
      <v-col cols="6" v-for="test in $store.state.publicTests">
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'BrowseTests',
  created() {
    this.$store.dispatch('loadPublicTests');
  },
};
</script>

<style scoped></style>
