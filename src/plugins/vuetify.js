import "roboto-fontface/css/roboto/roboto-fontface.css";
import '@mdi/font/css/materialdesignicons.css'

import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#fe7676",
        secondary: "#6F6093",
        accent: "#2F4858",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107"
      }
    }
  },
  icons: {
    iconfont: 'mdi',
  }
});
