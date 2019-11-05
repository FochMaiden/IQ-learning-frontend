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
    <v-layout row v-for="row in rows">
      <v-flex xs12 sm6 offset-sm3>
        <v-text-field
          :name="row.answer"
          v-on:change="emitToParent"
          label="Answer"
          id="answer"
          multi-line
          filled
          v-model="row.answerValue"
        ></v-text-field>
        <v-switch v-model="row.correct" label="correct"></v-switch>
        <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
            <v-btn
              v-bind="row.answer"
              v-on:click="removeRow(row)"
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
      inputs: ['answer'],
      rows: [],
      values: [],
    };
  },
  methods: {
    addRow: function(row) {
      this.rows.push({
        answer: this.inputs[this.rows.indexOf(row)],
        answerValue: '',
        correct: false,
      });
    },
    removeRow(row) {
      this.rows.splice(this.rows.indexOf(row), 1);
      console.log(this.rows);
    },
    emitToParent(row) {
      this.$emit('childToParent', this.rows);
    },
  },
};
</script>
<style scoped></style>
