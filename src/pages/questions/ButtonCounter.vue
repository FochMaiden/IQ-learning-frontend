<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-btn
          v-on:click="addRow"
          large
          dark
          block
          style="background-image: linear-gradient(to right, #fe7676, #f7717e, #ee6d85, #e46a8c, #d96891);"
          >Add Answer</v-btn
        >
      </v-flex>
    </v-layout>
    <v-layout row v-for="(row, index) in rows" :key="index" :row="row">
      <v-flex xs12 sm6 offset-sm3>
        <v-text-field
          :name="row.answer"
          label="Answer"
          id="answer"
          multi-line
          filled
          v-model="row.answerValue"
        ></v-text-field>
        <v-switch v-model="correct" label="correct"></v-switch>
        <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
            <v-btn
              v-bind="row.answer"
              v-on:click="removeRow"
              large
              dark
              block
              style="background-image: linear-gradient(to right, #fe7676, #f7717e, #ee6d85, #e46a8c, #d96891);"
              >remove Answer</v-btn
            >
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      currentInputIndex: 0,
      id: 0,
      correct: false,
      inputs: ['answer'],
      rows: [],
      values: {},
    };
  },
  methods: {
    addRow: function() {
      this.rows.push({
        answer: this.inputs[this.currentInputIndex],
        answerValue: '',
      });
      this.currentInputIndex++;
    },
    removeRow() {
      //this.rows.splice(this.row[index],1);
      console.log(this.rows[0]);
    },
  },
};
</script>
<style scoped></style>
