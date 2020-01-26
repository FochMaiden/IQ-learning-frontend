<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card class="mt-12" color="primary--text" shaped>
          <v-card-title> Welcome back {{ $auth.user().name }}! </v-card-title>
          <v-card-text>Checkout latest results for questions!</v-card-text>
          <v-card
            v-if="
              $store.state.lastResults && $store.state.lastResults.length !== 0
            "
            ref="card"
            :shaped="false"
            dark
            color="#252246"
            class="pa-2 ma-2"
          >
            <vue-funnel-graph
              :width="width"
              :height="height"
              :labels="labels"
              :values="values"
              :colors="colors"
              :direction="direction"
              :gradient-direction="direction"
              :animated="true"
              :display-percentage="true"
            />
          </v-card>
          <v-card-title v-else> Oh, there seem not to be any</v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row> </v-row>
    <v-row>
      <v-col>
        <v-card dark color="#EC77FF" min-height="10vh" shaped>
          <v-card-title dark> Create questions and tests here!</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined small to="/user/questions"
              >Questions
              <v-icon>mdi-file-edit-outline</v-icon>
            </v-btn>
            <v-btn outlined small to="/user/tests"
              >Tests
              <v-icon>mdi-clipboard-list-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card dark color="#7795FF" min-height="10vh" shaped>
          <v-card-title dark> Browse public tests here!</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined small to="/user/tests/public"
              >Public tests
              <v-icon>
                mdi-school
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card dark color="#FF3C8E" min-height="10vh" shaped>
          <v-card-title dark> Create article here!</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined small to="/user/articles/"
              >Articles
              <v-icon>
                mdi-clipboard-text-outline
              </v-icon></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { VueFunnelGraph } from 'vue-funnel-graph-js';

export default {
  name: 'Dashboard',
  components: {
    VueFunnelGraph,
  },
  computed: {
    labels() {
      let a = [];
      this.$store.state.lastResults.forEach(o => {
        a.push(o.text);
      });
      return a;
    },
    values() {
      let a = [];
      this.$store.state.lastResults.forEach(o => {
        a.push(o.result);
      });
      return a;
    },
    colors() {
      return ['#A0BBFF', '#EC77FF','#A0F9FF', '#7795FF'];
    },
    width() {
      return 1150;
    },
    height() {
      return 600;
    },
  },
  data() {
    return {
      card: null,
      direction: 'horizontal',
    };
  },
};
</script>

<style scoped></style>
