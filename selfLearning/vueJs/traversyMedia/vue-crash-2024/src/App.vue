<script setup>
import { ref } from 'vue';
const name = ref('John Doe');
const status = ref('active');
const tasks = ref(['Task One', 'Task Two', 'Task Three']);
const newTask = ref('');

const toggleStatus = () => {
  if (status.value === 'active') {
    status.value = 'pending';
  } else if (status.value === 'pending') {
    status.value = 'inactive';
  } else {
    status.value = 'active';
  }
};

const addTask = () => {
  if (newTask.value.trim() !== '') {
    tasks.value.push(newTask.value);
    newTask.value = '';
  }
}

const deleteTask = (index) => {
  tasks.value.splice(index, 1);
}
</script>

<template>
  <p v-if="status === 'active'">User {{ name }} is active</p>
  <p v-else-if="status === 'pending'">User {{ name }} is pending</p>
  <p v-else>User {{ name }} is inactive</p>

  <button @click="toggleStatus">Toggle button with @click</button>
  <button v-on:click="toggleStatus">Toggle button with v-on:click</button>

  <form v-on:submit.prevent="addTask">
    <label for="newTask">Add Task</label>
    <input type="text" id="newTask" name="newTask" v-model="newTask">
    <button type="submit">submit</button>
  </form>
  <h3>--Tasks--</h3>
  <ul>
    <li v-for="(task, index) in tasks" :key="task">
      <span>
        {{ task }}
        <button v-on:click="deleteTask(index)">x</button>
      </span>
    </li>
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
