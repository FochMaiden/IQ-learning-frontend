<template>
  <v-container fluid class="fill-height">
    <v-navigation-drawer width="25vh" floating permanent app>
      <template v-slot:prepend>
        <v-list>
          <v-list-item link two-line>
            <v-list-item-content>
              <v-list-item-title class="title"
                >{{ $auth.user().name }}
                {{ $auth.user().surname }}</v-list-item-title
              >
              <v-list-item-subtitle>{{
                $auth.user().email
              }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-menu-down</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </template>
      <v-divider></v-divider>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <router-view />
    <v-navigation-drawer width="35vh" right floating permanent app>
      <template v-slot:prepend>
        <v-list class="d-flex flex-wrap">
          <v-avatar color="orange" size="120" class="ma-auto">
            <span class="white--text headline">{{$auth.user().name[0] +  $auth.user().surname[0]}}</span>
          </v-avatar>
          <v-list-item two-line align="center" class="flex flex-wrap">
            <v-list-item-title class="title">
              {{ $auth.user().name }}
              {{ $auth.user().surname }}
            </v-list-item-title>
            <v-list-item-subtitle>
		            {{$auth.user().email}}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
export default {
  name: 'User',
};
</script>

<style scoped></style>
