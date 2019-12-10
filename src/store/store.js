import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

function initialState() {
  return {
    questions: null,
    publicQuestions: null,
    subjects: null,

  };
}

export default new Vuex.Store({
  state: initialState,
  getters: {},
  mutations: {},
  actions: {},
});
