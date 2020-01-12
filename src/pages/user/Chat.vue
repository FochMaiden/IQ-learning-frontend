<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-card>
          <v-list>
            <v-list-item v-for="user in users">
              <v-list-item-title>
                {{ user.name }}
              </v-list-item-title>
              <v-list-item-avatar class="elevation-6">
                <v-img :src="user.avatar"> </v-img>
              </v-list-item-avatar>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-list>
          <v-list-item v-for="user in users">
            <v-list-item-title>
              {{ user.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Chat',
  data() {
    return {
      users: [
        {
          name: 'huu',
          avatar:
            'https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light',
          date: '21.06.2019',
        },
        { name: 'bleop', avatar: '', date: '21.06.2019' },
        { name: 'annnn', avatar: '', date: '21.06.2019' },
        { name: 'kiep', avatar: '', date: '21.06.2019' },
      ],
    };
  },
};
</script>

<style scoped></style>
