<template>
  <div class="task-form">
    <h2>Create New Task</h2>
    <form @submit.prevent="create">
      <div class="form-group">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="task.title" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" v-model="task.description" class="form-control" required></textarea>
      </div>
      <div class="error-message" v-if="checkError">{{ checkError }}</div>
      <button type="submit" class="btn-create">Create Task</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const toast = useToast();

const authStore = useAuthStore();
const task = ref({
  title: '',
  description: '',
  status: 'pending',
});

onMounted(async () => {
  await authStore.fetchUserData();
})

const props = defineProps(['taskDetails']);

if (props.taskDetails) {
  task.value = { ...props.taskDetails };
}

const create = () => {
  if (!task.value.title.trim() || !task.value.description.trim()) {
    checkError.value = 'Title and description are required.';
    return;
  }

  const dataTask = {
    title: task.value.title.trim(),
    description: task.value.description.trim(),
    status: "pending",
    Date: new Date().toISOString(),
    userID: authStore.getUser.id,
  }
  console.log("Data task is ", dataTask)
  authStore.createTask(dataTask);

  task.value.title = '';
  task.value.description = '';
  task.value.status = '';
  task.value.dateTime = new Date().toISOString();
};

const checkError = ref('');
</script>

<style scoped>
.task-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  color: #555;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.error-message {
  color: #ff0000;
  margin-bottom: 10px;
}

.btn-create {
  background-color: #3498db;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-create:hover {
  background-color: #2980b9;
}
</style>
