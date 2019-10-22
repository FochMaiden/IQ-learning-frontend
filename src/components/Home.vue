<template>
	<p>HALLO{{this.$auth.user().username}}</p>
</template>

<script>
  export default {
	name: "Home"
  }
</script>

<style scoped>

</style>