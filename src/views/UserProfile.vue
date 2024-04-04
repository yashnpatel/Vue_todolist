<template>
  <div class="profile-container" v-if="!openUpdate">
    <h2>User Profile</h2>
    <table  class="profile-table">
      <tr>
        <th>Field</th>
        <th>Value</th>
      </tr>
      <tr>
        <td>Full Name</td>
        <td>{{ user.Fullname }}</td>
      </tr>
      <tr>
        <td>First Name</td>
        <td>{{ user.fname }}</td>
      </tr>
      <tr>
        <td>Last Name</td>
        <td>{{ user.lname }}</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>{{ user.email }}</td>
      </tr>
      <tr>
        <td>Phone</td>
        <td>{{ user.phone }}</td>
      </tr>
      <tr>
        <td>Gender</td>
        <td>{{ user.gender }}</td>
      </tr>
      <tr>
        <td>Hobby</td>
        <td>{{ user.Hobby }}</td>
      </tr>
      <tr>
        <td>Address</td>
        <td>{{ user.Address }}</td>
      </tr>
    </table>
    <button v-if="!openUpdate" class="submit-btn" @click="openEditForm">Update Profile</button>
  </div>
  <div class="profile-container" v-if="openUpdate">
    <h2>User Profile</h2>
    <form  class="profile-form" @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="fname">First Name:</label>
        <input type="text" id="fname" v-model="user.fname" required>
      </div>
      <div class="form-group">
        <label for="lname">Last Name:</label>
        <input type="text" id="lname" v-model="user.lname" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="user.email" disabled>
      </div>
      <div class="form-group">
        <label for="phone">Phone:</label>
        <input type="text" id="phone" v-model="user.phone" required>
      </div>
      <button type="submit" class="submit-btn">Update Profile</button>
    </form>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { onMounted, computed, ref } from "vue";


const authStore = useAuthStore();
const user = computed(() => authStore.user);

const openUpdate = ref(false); 
const openEditForm = () => {
  openUpdate.value = true;
};

const updateProfile = () => {
  const updatedUser = { ...user.value, email: authStore.user.email, Fullname: fname.value + ' ' + lname.value};
  authStore.updateProfile(updatedUser);
  console.log("Profile updated successfully");
  alert("Profile updated successfully");
  openUpdate.value = false;
};


onMounted(() => {
  authStore.fetchUserData();
});

</script>

<style scoped>
.profile-container {
  max-width: 400px;
  margin: 0 auto;
}

.profile-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
}

input[type="text"],
input[type="email"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #45a049;
}
.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.profile-table th,
.profile-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.profile-table th {
  background-color: #f2f2f2;
  text-align: left;
}

.profile-table td {
  text-align: left;
}



</style>