<template>
<div class="main page">
  
  <header>
    <div class="container">
      <nav>
        <div v-if="!isNotFoundPage" class="nav-links">
        
          <RouterLink to="/Welcome" v-if="isAuthenticated" class="nav-link">Dashbord</RouterLink>
          <RouterLink to="/dashbord" v-if="isAuthenticated" class="nav-link">Task</RouterLink>
          <RouterLink to="/about" v-if="isAuthenticated" class="nav-link">About</RouterLink>
          <RouterLink to="/Users" v-if="isAdmin()" class="nav-link">Users</RouterLink>
          <RouterLink to="/Updateprofile" v-if="isAuthenticated" class="nav-link">Update Profile</RouterLink>
          <button @click="logout" class="logout-button" v-if="isAuthenticated">Logout</button>
          {{}}
        </div>
       
        <div v-else>
          <button @click="$router.go(-1)" class="back-button">Go Back To Home Page</button>
        </div>
      </nav>
    </div>
  </header>
  <section>
      <transition :name="getTransitionName">
        <router-view v-slot="{ Component, route }">
          <component :is="Component" />
        </router-view>
      </transition>
    </section>
</div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import router from './router';
import {computed} from 'vue';
import { useAuthStore } from './stores/auth';
const authStore = useAuthStore();


import { ref } from 'vue'
let isAuthenticated = ref(false)
let isNotFoundPage = ref(false)

const role = computed(() => authStore.getRole);
console.log(role.value)

const isAdmin = () => {
    return role.value ===   localStorage.getItem('Role');
};
console.log(isAdmin())

router.beforeEach((to) =>{
  isAuthenticated.value = JSON.parse(localStorage.getItem('islogedIn'))
  isNotFoundPage.value = to.name === 'NotFound';
});

const logout = async () => {
  console.log('Logout successful');
  await authStore.logout();
  localStorage.removeItem('token');
  localStorage.removeItem('Role');
  localStorage.removeItem('userid');
  localStorage.setItem('islogedIn', false);
  console.log('Logout successful');
  router.push({ path: '/' });
};
</script>

<style scoped>
header {
  
  color: #fff;
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

nav {
  display: flex;
  background-color: #343a40;
  justify-content: center;
  align-items: center;
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-link, .logout-button, .back-button {
  text-decoration: none;
  color: #fff;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  margin-right: 10px;
}

.nav-link:last-child {
  margin-right: 0;
}

.nav-link:hover, .logout-button:hover, .back-button:hover {
  background-color: #4d5a63;
}

.logout-button, .back-button {
  background-color: #dc3545;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to {
  opacity: 0.8;
}


@media (max-width: 768px) {
  nav {
    flex-direction: column;
    gap: 10px;
  }

  .nav-links {
    align-items: flex-start;
  }

  .nav-link, .logout-button, .back-button {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>
