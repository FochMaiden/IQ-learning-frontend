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
        ></v-flex
      >
    </v-layout>
    <v-layout row v-for="row in rows">
      <v-flex xs12 sm6 offset-sm3>
        <v-text-field
          :name="row.answer"
          label="Answer"
          id="answer"
          multi-line
          filled
          v-model="row.answerValue"
        ></v-text-field>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      currentInputIndex: 0,
      inputs: ['answer'],
      rows: [],
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
  },
};
</script>
<style scoped></style>
