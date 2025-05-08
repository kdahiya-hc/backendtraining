<script setup>
import { ref } from 'vue';
const name = ref('John Doe');
const status = ref('active');
const tasks = ref(['Task One', 'Task Two', 'Task Three']);

const toggleStatus = () => {
  if (status.value === 'active') {
    status.value = 'pending';
  } else if (status.value === 'pending') {
    status.value = 'inactive';
  } else {
    status.value = 'active';
  }
};
</script>

<template>
  <p v-if="status === 'active'">User {{ name }} is active</p>
  <p v-else-if="status === 'pending'">User {{ name }} is pending</p>
  <p v-else>User {{ name }} is inactive</p>

  <button @click="toggleStatus">Toggle button with @click</button>
  <button v-on:click="toggleStatus">Toggle button with v-on:click</button>

  <h3>--Tasks--</h3>
  <ul>
    <li v-for="task in tasks" :key="task">{{ task }}</li>
  </ul>

  <!-- <a v-bind:href="'https://www.google.com'">Click for Google</a> -->
  <!-- <a :href="'https://www.google.com'">Click for Google</a> -->

</template>

<style scoped>
h1 {
  color: aquamarine;
}
.app {
  background-color: white;
  color: black;
  min-height: 100vh;
  padding: 2rem;
}
</style>
