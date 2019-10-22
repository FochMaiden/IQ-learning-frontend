<template>
	<v-container style="background-image: " fluid class="fill-height">
		<v-row align="center" justify="center">
			<v-col cols="12" sm="8" md="4">
				<v-form>
					<v-text-field
							label="Username"
							name="username"
							v-model="username"
							type="text"
							outlined
							rounded
					></v-text-field>
					<v-text-field
							label="E-mail"
							name="email"
							v-model="email"
							type="text"
							outlined
							rounded
					></v-text-field>
					<v-text-field
							label="Name"
							name="name"
							v-model="name"
							type="text"
							outlined
							rounded
					></v-text-field>
					<v-text-field
							label="Surname"
							name="surname"
							v-model="surname"
							type="text"
							outlined
							rounded
					></v-text-field>
					<v-text-field
							id="password"
							label="Password"
							name="password"
							v-model="password"
							type="password"
							outlined
							rounded
					></v-text-field>
				</v-form>
				<v-spacer></v-spacer>
				<v-card-actions>
					<v-btn class="primary" block rounded v-on:click="register">Register</v-btn>
				</v-card-actions>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
  export default {
	name: "Register",
	data() {
	  return {
		username: null,
	    email:null,
	    name: null,
	    surname: null,
		password: null
	  };
	},
	methods: {
	  register() {
		this.$auth.register({
		  url: "/user/register",
		  method: "POST",
		  headers: {
			authorization: "bearer null"
		  },
		  data: {
			username: this.username,
			email: this.email,
			name: this.name,
			surname: this.surname,
			password: this.password
		  },
		  autoLogin: false,
		  rememberMe: true,
		  success: function(response) {
			this.$auth.user(response.data);
			this.$auth.token(null, response.data.sessionID);
		  },
		  error: function(err) {}
		});
	  }
	}
  }
</script>

<style scoped>

</style>