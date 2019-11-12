import axios from 'axios';
import Vue from 'vue';
const errorHandler = error => {
  //console.log('Error response',error.response, 'code' , error.response.status);
  if (error.response.status === 401) {
    Vue.auth.logout();
  }
};
const successHandler = response => {
  return response;
};

export const restApi = {
  axiosProxy: null,

  createAxiosProxy(token) {
    this.createAxiosInstance(token);
  },
  createAxiosInstance(token) {
    return (this.axiosProxy = axios.create({
      baseURL: 'http://localhost:8080',
      headers: {
        authorization: 'bearer ' + token,
      },
    }));
  },
  interceptor() {
    return this.axiosProxy.interceptors.response.use(
      response => successHandler(response),
      error => errorHandler(error)
    );
  },
  login(username, password, rememberMe) {
    return Vue.auth
      .login({
        data: {
          username: username,
          password: password,
        },
        rememberMe: rememberMe,
        success: function(response) {
          this.$auth.user(response.data);
          this.$auth.token(null, response.data.sessionID);
        },
      })
      .then(response => {
        this.createAxiosInstance(response.data.sessionID);
      });
  },
  register(username, email, name, surname, password, autoLogin) {
    return Vue.auth
      .register({
        data: {
          username: username,
          email: email,
          name: name,
          surname: surname,
          password: password,
        },
        autoLogin: autoLogin,
        rememberMe: true,
        success: async function(response) {
          this.$auth.user(response.data);
          this.$auth.token(null, response.data.sessionID);
        },
      })
      .then(response => {
        autoLogin && this.createAxiosInstance(response.data.sessionID);
      })
      .catch(err => {
        return err.response.data;
      });
  },
  getSubjects() {
    return this.axiosProxy
      .get('/subject/get')
      .then(response => {
        return response.data;
      })
      .catch(err => {
        return err.response.data;
      });
  },
  getUserQuestions() {
    return this.axiosProxy
      .get('/question/get/user')
      .then(response => {
        return response.data;
      })
      .catch(err => err.response);
  },
  addQuestion(subject, question, shareable, choiceTest, answers) {
    return this.axiosProxy
      .put('/question/add', {
        subject: subject,
        question: question,
        shareable: shareable,
        choiceTest: choiceTest,
        answers: answers,
      })
      .then(response => {
        return { rsp: response.data, msg: 'Question Added' };
      })
      .catch(err => {
        return err.response.data.error;
      });
  },
  filterQuestionsBySubject(id) {
    return this.axiosProxy
      .get(`/question/get/subject/` + id)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        return err.response.data;
      });
  },
};
