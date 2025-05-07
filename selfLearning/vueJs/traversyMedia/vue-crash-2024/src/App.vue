<script>
export default {
  data() {
    return {
      name: 'John Doe',
      status: true
    };
  },
  methods: {
    toggleStatus() {
      this.status = !this.status;
    }
  }
}
</script>

<template>
  <p v-if="status">User {{ name }} is Active</p>
  <button @click="toggleStatus">Toggle Status</button>
</template>

<style scoped>
h1 {
  color: aquamarine;
}
</style>
