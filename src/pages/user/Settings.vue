<template>
  <v-container fill-height fluid>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-card flat color="primary--text" class="pa-5">
          <v-list-item-title class="primary2--text"
            >Hello {{ $username }}, you can change your avatar and other user
            setting here!
          </v-list-item-title>
          <v-divider></v-divider>
          <v-row>
            <v-col class="d-flex flex-wrap">
              <v-avatar color="accent" size="100" class="ma-auto">
                <v-img v-if="$auth.user().avatar" :src="$auth.user().avatar" />
                <v-dialog v-model="dialog" max-width="800px">
                  <template v-slot:activator="{ on }">
                    <v-btn dark x-small absolute bottom right fab v-on="on"
                      ><v-icon>mdi-plus</v-icon></v-btn
                    >
                  </template>
                  <v-container>
                    <v-card class="flex">
                      <v-row>
                        <v-avatar size="200" class="ma-auto">
                          <v-img :src="avatarUrl"></v-img>
                        </v-avatar>
                        <form class="ma-auto py-8 overflow-auto">
                          <v-select
                            :items="avatar.itemsTop"
                            v-model="avatar.selectedItemTop"
                            label="Top"
                            dense
                          ></v-select>
                          <v-select
                            :items="avatar.itemsAccessories"
                            v-model="avatar.selectedItemAccessories"
                            label="Accessories"
                            dense
                          ></v-select>
                          <v-select
                            v-if="avatar.selectedItemTop.includes('Hair')"
                            :items="avatar.itemsHairColor"
                            v-model="avatar.selectedItemHairColor"
                            label="Hair color"
                            dense
                          ></v-select>
                          <v-select
                            v-if="
                              !avatar.selectedItemTop.includes('Hair') &&
                                avatar.selectedItemTop !== 'Hat'
                            "
                            :items="avatar.itemsColorHat"
                            v-model="avatar.selectedItemColorHat"
                            label="Hat color"
                            dense
                          ></v-select>
                          <v-select
                            :items="avatar.itemsFacialHair"
                            v-model="avatar.selectedItemFacialHair"
                            label="Facial hair"
                            dense
                          ></v-select>
                          <v-select
                            :items="avatar.itemsClothes"
                            v-model="avatar.selectedItemClothes"
                            label="Clothes"
                            dense
                          ></v-select>
                          <v-select
                            v-if="
                              !avatar.selectedItemClothes.includes('Blazer')
                            "
                            :items="avatar.itemsColorClothes"
                            v-model="avatar.selectedItemColorClothes"
                            label="Clothes color"
                            dense
                          ></v-select>
                          <v-select
                            v-if="
                              avatar.selectedItemClothes.includes('Graphic')
                            "
                            :items="avatar.itemsGraphicClothes"
                            v-model="avatar.selectedItemGraphicClothes"
                            label="Clothes Graphic"
                            dense
                          ></v-select>
                          <v-select
                            :items="avatar.itemsEyes"
                            v-model="avatar.selectedItemEyes"
                            label="Eyes"
                            dense
                          ></v-select>
                          <v-select
                            :items="avatar.itemsEyebrows"
                            v-model="avatar.selectedItemEyebrows"
                            label="Eyebrows"
                            dense
                          ></v-select>
                          <v-select
                            :items="avatar.itemsMouth"
                            v-model="avatar.selectedItemMouth"
                            label="Mouth"
                            dense
                          ></v-select>
                          <v-select
                            :items="avatar.itemsSkinColor"
                            v-model="avatar.selectedItemSkinColor"
                            label="Skin color"
                            dense
                          ></v-select>
                          <v-btn
                            dark
                            style="background-image: linear-gradient(to right, #fe7676, #f7717e, #ee6d85, #e46a8c, #d96891);"
                            v-on:click="saveAvatar"
                          >
                            Save
                          </v-btn>
                        </form>
                      </v-row>
                    </v-card>
                  </v-container>
                </v-dialog>
                <span class="white--text headline">
                  {{ initials }}
                </span>
              </v-avatar>
            </v-col>
            <v-col>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  dark
                  style="background-image: linear-gradient(to right, #fe7676, #f7717e, #ee6d85, #e46a8c, #d96891);"
                  v-on:click="saveSettings"
                  >Save settings</v-btn
                ></v-card-actions
              >
              <v-text-field
                label="E-mail"
                v-model="email"
                outlined
                dense
                class="ma-auto"
              >
              </v-text-field>
              <v-textarea
                label="Bio"
                v-model="bio"
                outlined
                hide-details
                class="ma-auto"
              >
              </v-textarea>
              <div class="text-center">
                <v-menu
                  v-for="(social, i) in socials"
                  v-model="menu[i]"
                  :close-on-content-click="false"
                  :nudge-width="200"
                  offset-x
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :key="i"
                      :color="social.color"
                      class="white--text"
                      fab
                      icon
                      small
                      v-on="on"
                    >
                      <v-icon>{{ social.icon }}</v-icon>
                    </v-btn>
                  </template>
                  <v-card max-width="40vh" class="pa-3">
                    <v-list-item-content>
                      <v-list-item-title
                        >Add or edit your
                        {{ social.name }} info</v-list-item-title
                      >
                      <v-divider></v-divider>
                      <v-list-item-subtitle v-if="$auth.user()[social.name]"
                        >Current link:
                        {{ $auth.user()[social.name] }}</v-list-item-subtitle
                      >
                      <v-text-field
                        outlined
                        dense
                        class="mt-3 mb-0"
                        hide-details
                        v-model="model[social.name]"
                        :label="social.name"
                      ></v-text-field>
                    </v-list-item-content>

                    <v-card-actions>
                      <v-btn
                        dark
                        style="background-image: linear-gradient(to right, #fe7676, #f7717e, #ee6d85, #e46a8c, #d96891);"
                        v-on:click="saveSettings"
                        >save</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </div>
            </v-col>
          </v-row>
          <v-form v-model="validName">
            <v-list-item-title class="primary2--text"
              >Change or add name and surname</v-list-item-title
            >
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Name"
                  v-model="name"
                  outlined
                  dense
                  :rules="[minLength('name', 3), isName()]"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Surname"
                  v-model="surname"
                  outlined
                  dense
                  :rules="[minLength('surname', 3), isName()]"
                />
              </v-col>
            </v-row>
          </v-form>
          <v-form v-model="validPass">
            <v-list-item-title class="primary2--text"
              >Change password</v-list-item-title
            >

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  v-model="password"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  id="newPassword"
                  label="New password"
                  name="New password"
                  type="password"
                  v-model="newPassword"
                  :rules="[
                    minLength(newPassword, 8),
                    passwordNumber(),
                    passwordUppercase(),
                  ]"
                  outlined
                  dense
                />
                <v-btn
                  dark
                  style="background-image: linear-gradient(to right, #fe7676, #f7717e, #ee6d85, #e46a8c, #d96891);"
                  v-on:click="savePassword"
                  :disabled="!validPass"
                  >Change password</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
	import {isName, minLength, passwordNumber, passwordUppercase, required,} from '../../util/validationFunctions';
	import {
		accessoriesAvatar,
		clothesAvatar,
		clothesGraphicAvatar,
		colorAvatar,
		eyebrowsAvatar,
		eyesAvatar,
		facialHairAvatar,
		hairColorAvatar,
		mouthAvatar,
		skinColorAvatar,
		topAvatart,
	} from '../../util/avatarPropherties';
	import {restApi} from '../../api/restApi';

	export default {
  name: 'Settings',
  data() {
    return {
      avatar: {
        selectedItemTop: 'LongHairBigHair',
        itemsTop: topAvatart,

        selectedItemAccessories: 'Blank',
        itemsAccessories: accessoriesAvatar,

        selectedItemColorHat: 'Black',
        itemsColorHat: colorAvatar,

        selectedItemHairColor: 'Brown',
        itemsHairColor: hairColorAvatar,

        selectedItemFacialHair: 'Blank',
        itemsFacialHair: facialHairAvatar,

        selectedItemClothes: 'BlazerShirt',
        itemsClothes: clothesAvatar,

        selectedItemColorClothes: 'Black',
        itemsColorClothes: colorAvatar,

        selectedItemGraphicClothes: 'Bat',
        itemsGraphicClothes: clothesGraphicAvatar,

        selectedItemEyes: 'Default',
        itemsEyes: eyesAvatar,

        selectedItemEyebrows: 'Default',
        itemsEyebrows: eyebrowsAvatar,

        selectedItemMouth: 'Default',
        itemsMouth: mouthAvatar,

        selectedItemSkinColor: 'Light',
        itemsSkinColor: skinColorAvatar,
      },

      dialog: null,

      menu: [null, null, null, null],

      username: null,
      email: null,
      name: null,
      surname: null,
      bio: null,
      model: {
        linkedIn: null,
        twitter: null,
        reddit: null,
        youtube: null,
      },

      password: null,
      newPassword: null,
      initials: '',
      socials: [
        {
          name: 'linkedIn',
          icon: 'mdi-linkedin-box',
          color: 'cyan darken-1',
        },
        {
          name: 'twitter',
          icon: 'mdi-twitter-box',
          color: 'blue lighten-3',
        },
        {
          name: 'reddit',
          icon: 'mdi-reddit',
          color: 'orange darken-2',
        },
        {
          name: 'youtube',
          icon: 'mdi-youtube',
          color: 'red',
        },
      ],
      validName: false,
      validPass: false,
      required,
      passwordNumber,
      passwordUppercase,
      minLength,
      isName,
    };
  },
  computed: {
    avatarUrl() {
      return (
        `https://avataaars.io/?avatarStyle=Transparent&topType=` +
        this.avatar.selectedItemTop +
        `&accessoriesType=` +
        this.avatar.selectedItemAccessories +
        `&hairColor=` +
        this.avatar.selectedItemHairColor +
        `&hatColor=` +
        this.avatar.selectedItemColorHat +
        `&facialHairType=` +
        this.avatar.selectedItemFacialHair +
        `&clotheType=` +
        this.avatar.selectedItemClothes +
        `&clotheColor=` +
        this.avatar.selectedItemColorClothes +
        `&graphicType=` +
        this.avatar.selectedItemGraphicClothes +
        `&eyeType=` +
        this.avatar.selectedItemEyes +
        `&eyebrowType=` +
        this.avatar.selectedItemEyebrows +
        `&mouthType=` +
        this.avatar.selectedItemMouth +
        `&skinColor=` +
        this.avatar.selectedItemSkinColor
      );
    },
  },
  methods: {
    saveSettings() {
      restApi
        .saveSettings(
          this.email,
          this.name,
          this.surname,
          null,
          this.bio,
          this.model.linkedIn,
          this.model.twitter,
          this.model.reddit,
          this.model.youtube
        )
        .then(response => {
          this.$auth.user(response);
        });
    },
    saveAvatar() {
      restApi
        .saveSettings(
          this.email,
          this.name,
          this.surname,
          this.avatarUrl,
          this.bio,
          this.model.linkedIn,
          this.model.twitter,
          this.model.reddit,
          this.model.youtube
        )
        .then(response => {
          this.$auth.user(response);
        });
    },
    savePassword() {
      restApi.changePassword(this.password, this.newPassword);
    },
  },
};
</script>

<style scoped></style>
