<template>
  <v-container>
    <v-combobox
      label="Subjects"
      v-model="selectedSubjects"
      :items="$store.getters.subjects"
      chips
      item-value="id"
      return-object
      @click:clear="clear"
      prepend-icon="filter_list"
      solo
      multiple
      clearable
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
      <v-col cols="6" v-for="test in tests">
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
  data() {
    return {
      selectedSubjects: null,
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
  },
  methods: {
    clear() {},
    remove(item) {
      if (this.selectedSubjects.length === 1) {
        this.selectedSubjects = null;
      } else {
        this.selectedSubjects.splice(this.selectedSubjects.indexOf(item), 1);
        this.selectedSubjects = [...this.selectedSubjects];
      }
    },
  },
};
</script>

<style scoped></style>