import Vuex from 'vuex';
import Vue from 'vue';
import { restApi } from '../api/restApi';

Vue.use(Vuex);

function initialState() {
  return {
    subjects: null,

    loadingQuestions: true,
    userQuestions: [],

    publicQuestions: [],
    allQuestions: [],
    filteredQuestions: [],
  };
}

export default new Vuex.Store({
  state: initialState,
  getters: {
    subjects: state => state.subjects,

    userQuestions: state => state.userQuestions,
    publicQuestions: state => state.publicQuestions,
    allQuestions: state => state.allQuestions,
    filteredQuestions: state => state.filteredQuestions,
  },
  mutations: {
    setSubjects(state, data) {
      state.subjects = data;
    },

    setQuestionsLoading(state, data) {
      state.loadingQuestions = data;
    },
    setUserQuestions(state, data) {
      state.userQuestions = data;
    },
    setPublicQuestions(state, data) {
      state.publicQuestions = data;
    },
    setAllQuestions(state) {
      state.allQuestions = state.userQuestions.concat(state.publicQuestions);
    },
    filterAllQuestions(state, data) {
      state.filteredQuestions = state.allQuestions.filter(item => {
        return item.subject.id === data;
      });
    },
    filterUserQuestions(state, data) {
      state.filteredQuestions = state.userQuestions.filter(item => {
        return item.subject.id === data;
      });
    },
  },
  actions: {
    loadSubjects({ commit }) {
      restApi.getSubjects().then(response => {
        return commit('setSubjects', response);
      });
    },
    loadUserQuestions({ commit }) {
      commit('setQuestionsLoading', true);
      restApi.getUserQuestions().then(response => {
        commit('setQuestionsLoading', false);
        return commit('setUserQuestions', response);
      });
    },
    loadPublicQuestions({ commit }) {
      restApi.getPublicQuestions().then(async response => {
        await commit('setPublicQuestions', response);
        commit('setAllQuestions');
      });
    },
  },
});
