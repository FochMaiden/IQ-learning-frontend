<template>
  <v-form ref="form" v-model="valid" :lazy-validation="lazy">
    <v-text-field
      v-model="title"
      :counter="104"
      label="Title"
      required
    ></v-text-field>
    <v-file-input label="File input" accept=".jpg,.png"></v-file-input>
    <v-textarea
      outlined
      name="input-7-4"
      label="Enter your article"
      value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
      auto-grow
      clearable
      filled
    ></v-textarea>
    <v-select
      v-model="select"
      :items="items"
      :rules="[v => !!v || 'Item is required']"
      label="Tags"
      required
    ></v-select>

    <v-btn color="primary" class="mr-4" @click="Submit">
      Add article
    </v-btn>
  </v-form>
</template>

<script>
export default {
  name: 'Articles',
  data() {
    return {
      items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    };
  },
};
</script>

<style scoped></style>
