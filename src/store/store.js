import Vuex from 'vuex';
import Vue from 'vue';
import { restApi } from '../api/restApi';
import { merge } from '../util/utilFunctions';

Vue.use(Vuex);

function initialState() {
  return {
    messages: null,

    subjects: null,

    loadingQuestions: true,
    userQuestions: [],

    publicQuestions: [],
    allQuestions: [],
    filteredQuestions: [],

    userTests: [],
    filteredUserTests: [],
    publicTests: [],
    filteredPublicTests: [],

    testResults: [],
    questionResults: [],
    lastResults: null,

    articles: [],
    userArticles: [],
    articleTags: [],
    articleComments: [],
    article: null,
  };
}

export default new Vuex.Store({
  state: initialState,
  getters: {
    messages: state => state.messages,

    subjects: state => state.subjects,

    userQuestions: state => state.userQuestions,
    publicQuestions: state => state.publicQuestions,
    allQuestions: state => state.allQuestions,
    filteredQuestions: state => state.filteredQuestions,

    userTests: state => state.userTests,
    filteredUserTests: state => state.filteredUserTests,
    publicTests: state => state.publicTests,
    filteredPublicTests: state => state.filteredPublicTests,

    testResults: state => state.testResults,
    questionResults: state => state.questionResults,
    lastResults: state => state.lastResults,

    articles: state => state.articles,
    userArticles: state => state.userArticles,
    articleTags: state => state.articleTags,
    articleComments: state => state.articleComments,
    article: state => state.article,
  },
  mutations: {
    setMessages(state, data) {
      state.messages = { ...state.messages, [data[0].conversationId]: data };
    },
    addMessage(state, data) {
      //why the heck is this working
      state.messages[data.conversationId].push(data);
    },
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
      state.allQuestions = merge(
        state.userQuestions,
        state.publicQuestions,
        'id'
      );
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
    setUserTests(state, data) {
      state.userTests = data;
    },
    setFilteredUserTests(state, data) {
      state.filteredUserTests = data.sort((a, b) => (a.id > b.id ? 1 : -1));
    },
    setPublicTests(state, data) {
      state.publicTests = data;
    },
    filterPublicTests(state, data) {
      let filtered = [];
      if (data.length === 1) {
        filtered = state.publicTests.filter(item => {
          return item.subject === data[0];
        });
      } else if (data.length !== 0) {
        filtered = state.publicTests.filter(item => {
          return data.includes(item.subject);
        });
      }
      state.filteredPublicTests = filtered.sort((a, b) =>
        a.id > b.id ? 1 : -1
      );
    },
    setTestResults(state, response) {
      state.testResults = response;
    },
    setQuestionResults(state, response) {
      state.questionResults = {
        ...state.questionResults,
        [response[0].questionId]: response,
      };
    },
    setLastResults(state, data) {
      state.lastResults = data;
    },
    setArticles(state, data) {
      state.articles = data;
    },
    setUserArticles(state, data) {
      state.userArticles = data;
    },
    setArticleTags(state, data) {
      state.articleTags = data;
    },
    setArticleComments(state, data) {
      state.articleComments = data;
    },
    setCurrentArticle(state, data) {
      console.log(data);
      state.article = data;
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
      restApi.getUserQuestions().then(async response => {
        commit('setQuestionsLoading', false);
        await commit('setUserQuestions', response);
        commit('setAllQuestions');
      });
    },
    loadPublicQuestions({ commit }) {
      restApi.getPublicQuestions().then(async response => {
        await commit('setPublicQuestions', response);
        commit('setAllQuestions');
      });
    },
    loadUserTests({ commit }) {
      restApi.getUserTests().then(response => {
        commit('setUserTests', response);
      });
    },
    loadFilteredUserTests({ commit }, id) {
      restApi.getUserTestsById(id).then(response => {
        commit('setFilteredUserTests', response);
      });
    },
    loadPublicTests({ commit }) {
      restApi.getPublicTests().then(response => {
        commit('setPublicTests', response);
      });
    },
    loadFilteredPublicTests({ commit }, id) {
      restApi.getPublicTestsById(id).then(response => {
        commit('setFilteredPublicTests', response);
      });
    },
    loadLastResults({ commit }) {
      restApi.getLastResults().then(response => {
        commit('setLastResults', response);
      });
    },
    loadArticles({ commit }) {
      restApi.getArticles().then(response => {
        commit('setArticles', response);
      });
    },
    loadUserArticles({ commit }) {
      restApi.getUserArticles().then(response => {
        commit('setUserArticles', response);
      });
    },
    loadArticleTags({ commit }) {
      restApi.getArticleTags().then(response => {
        commit('setArticleTags', response);
      });
    },
    loadArticleComments({ commit }, id) {
      restApi.getArticleComments(id).then(response => {
        commit('setArticleComments', response);
      });
    },
    loadArticle({ commit }, article) {
      console.log('wszedlem', article);

      console.log(this.state.article);
    },
  },
});
