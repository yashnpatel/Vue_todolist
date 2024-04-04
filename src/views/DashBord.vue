<template>
  <div class="container">

    <!-- <Welcome></Welcome> -->
    <div class="welcome"><span>Welcome To </span>
      <h2>{{ user.fname }} </h2>
    </div>
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
      <button type="submit" class="btn-create" v-if="!editing">Create Task</button>
      <button class="btn-create" v-else @click="Eddititem()">Edit Task</button>
    </form>


    <div class="searching">
      <input type="text" v-model="search" placeholder="Search Task">
    </div>
    <div class="task-list" v-if="searchingTask.length > 0">

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1" class="btn-create">Previous</button>
        <span class="spanlawerer"> {{ currentPage }} </span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-create">Next</button>
        <span>{{ startvalue }} - {{ endindexsdsd }} out of {{ searchingTask.length }}</span>
      </div>

      <ul class="task-items">
        <div class="itemsoftask">
        </div>
        <li v-for="(task, index) in paginatedTasks" :key="index" class="task-item">
          <div class="btn23">
            <div v-if="task.status == 'pending'">
              <input type="checkbox" id="complete" v-model="task.status"
                @change="updateTaskStatus(task.id, $event.target.checked ? 'complete' : 'pending', new Date().toISOString())">
            </div>
            <div v-else>
              <FontAwesomeIcon :icon="faCheckIcon"
                @click="updateTaskStatus(task.id, 'pending', new Date().toISOString())" class="checked" />
            </div>
            <label :for="'task-' + task.id">{{ task.title }}</label>
            <p>
              <button class="butvn33" @click="removeTask(task.id)">
                <FontAwesomeIcon :icon="faTrashIcon" />
              </button>
              <button class="butvn33" @click="edit(task)">
                <FontAwesomeIcon :icon="faeditIcon" />
              </button>
            </p>


          </div>
          <p class="task-description">{{ task.description }} </p>
          <span class="task-status">{{ task.status }}</span>
          <div class="task-date">{{ formatDate(task.Date) }}</div>
          <div class="task-time">{{ formatTime(task.Date) }}</div>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No tasks available.</p>
    </div>

  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../stores/auth';
import { ref, onMounted, computed, watch } from 'vue';
import Swal from 'sweetalert2'
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const task = ref({
  title: '',
  description: '',
  status: 'pending',
});
const id = ref();

const toast = useToast();
const editing = ref(false);

const checkError = ref('');
const authStore = useAuthStore();
const tasks = computed(() => authStore.tasks);
const user = computed(() => authStore.getUser);
const search = ref('');
const perPage = 5;
let currentPage = ref(1);
const startvalue = ref(1)
const endindexsdsd = ref(1)


const edit = (tasks) => {
  task.value.title = tasks.title
  task.value.description = tasks.description
  id.value = tasks.id,
  editing.value = true;

};


onMounted(() => {
  authStore.fetchUserData();
  authStore.fetchTaskData();
});

const searchingTask = computed(() => {
  return tasks.value.filter(task => task.title.toLowerCase().includes(search.value.toLowerCase()));
});



const updateTaskStatus = (id, newStatus, date) => {
  authStore.updateTaskStatus(id, newStatus, date);
  toast.open({
    message: `status  ${id} is update sucessfully `,
    position: "top-right",
    type: "success",
    duration: 3000,
    dismissible: true
  });
};


const removeTask = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to remove this task?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'green',
    cancelButtonColor: 'red',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      const tasksLength = searchingTask.value.length;
      authStore.removeTask(id);

      Swal.fire(
        'Deleted!',
        'Your task has been deleted.',
        'success'
      );
      if (tasksLength % perPage === 1 && currentPage.value > 1) {
        currentPage.value--;
      }
    }
  }).catch((err) => { console.log("sdasdsd vsdfsdf", err) });
};


watch(searchingTask, () => {
  currentPage.value = 1;
});


const faTrashIcon = faTrash;
const faCheckIcon = faCheck;
const faeditIcon = faPenToSquare;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString();
};

const totalPages = computed(() => Math.ceil(searchingTask.value.length / perPage));

const paginatedTasks = computed(() => {
  const startIndex = (currentPage.value - 1) * perPage;
  startvalue.value = startIndex + 1;
  const endindex = Math.min(startIndex + perPage, searchingTask.value.length)
  endindexsdsd.value = endindex
  return searchingTask.value.slice(startIndex, endindex);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const Eddititem = () => {
  console.log("this is going to eddit task")
  const dataTask = {
    title: task.value.title.trim(),
    description: task.value.description.trim(),
    UpdatedDate: new Date().toISOString()
  }
  authStore.updateTaskTitle(id.value, dataTask)
  .then(() => {
      id.value = '';
      task.value.title = '';
      task.value.description = '';
      editing.value = false;
    })
    .catch((error) => {
      console.error('Error updating task title:', error);
    });
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
</script>



<style scoped>
.container {
  max-width: 1250px;
  margin: 0 auto;
  padding: 20px;
}

.welcome {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.searching {
  margin-bottom: 20px;
  padding-top: 15px;
  text-align: center;
}

.spanlawerer {
  padding: 5px 5px;
  font-size: 20px;
}

svg.svg-inline--fa.fa-check.checked {
  padding-top: 8px;
  color: blue;
  cursor: pointer;

}

svg.svg-inline--fa.fa-check.checked:hover {
  color: darkblue;
  font-size: medium;
}

.searching input[type="text"] {
  width: 50%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  align-items: center
}

.welcome h2 {
  display: inline;
}

.task-list {
  display: block;
  padding: 15px;
  justify-content: space-between
}

.custom-input {
  border: none;
  background-color: transparent;
  padding: 0;
  font-size: inherit;
  font-family: inherit;
  width: auto;

}

.section {
  flex: 1;
  margin: 0 10px;
}

.checked {
  text-align: center;
}

.section-title {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.task-items {
  list-style: none;
  padding: 0;
}

.task-item {
  background-color: #f9f9f9;

  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 50%;
  padding: 10px;
}

.task-item input[type="checkbox"] {
  margin-right: 10px;
}

.task-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.task-description {
  margin-top: 5px;
  color: #666;
}

.task-status {
  font-size: 14px;
  color: #999;
}

.task-date,
.task-time {
  margin-top: 5px;
  font-size: 14px;
  color: #888;
}

.btn23 {
  display: flex;
  justify-content: space-between;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
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

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}
</style>
