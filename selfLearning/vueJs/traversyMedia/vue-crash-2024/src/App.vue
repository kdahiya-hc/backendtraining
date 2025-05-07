<script>
export default {
  data() {
    return {
      name: 'John Doe',
      status: 'pending'
    };
  },
  methods: {
    toggleStatus() {
      if (this.status === 'active') {
        this.status = 'pending';
      } else if (this.status === 'pending') {
        this.status = 'inactive';
      } else {
        this.status = 'active';
      }
    }
  }
}
</script>

<template>
  <p v-if="status === 'active'">User {{ name }} is active</p>
  <p v-else-if="status === 'pending'">User {{ name }} is pending</p>
  <p v-else>User {{ name }} is inactive</p>
  <button @click="toggleStatus">Toggle Status</button>
</template>

<style scoped>
h1 {
  color: aquamarine;
}
</style>
