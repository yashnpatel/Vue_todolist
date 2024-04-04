<template>
    <div class="login-container">
        <h1>Login</h1>
        <form class="login-form">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" v-model="formData.username" id="username" placeholder="Enter your username">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" v-model="formData.password" id="password" placeholder="Enter your password">
            </div>
            <p v-if="loginerr" class="error-message">{{ loginerr }}</p>
            <button @click.prevent="login" class="btn-login">Login</button>
            <RouterLink to="/" v-if="!isAuthenticated" class="nav-link">Login</RouterLink>
            <RouterLink to="/registration" v-if="!isAuthenticated" class="nav-link">Registration</RouterLink>

        </form>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { RouterLink } from 'vue-router'
import { ref, computed } from 'vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';


const toast = useToast();
const authStore = useAuthStore();
const role = computed(() => authStore.getRole);
const router = useRouter();
const loginerr = ref('')

const formData = ref({
    username: '',
    password: ''
});

const isAdmin = () => {
    return role.value === 'Admin';
};
const login = async () => {
    try {
        await authStore.login(formData.value);
        if (authStore.isAuthenticated) {
            const abc = 183700;
            localStorage.setItem('token', abc);
            localStorage.setItem('islogedIn', true);
            console.log(isAdmin())
            if (isAdmin()) {
                localStorage.setItem('Role','Admin')
                router.push({ path: '/admin' });
                console.log(isAdmin())
            } else {
                router.push({ path: '/Welcome' });
            }
        }
        else {
            authStore.error = 'Invalid username or password';

        }
    } catch (err) {
        console.error('Error logging in:', err);
        formData.value.username = '';
        formData.value.password = '';
        toast.open({
            message: `Invalid username or password`,
            position: "top-right",
            type: "error",
            duration: 3000,
            dismissible: true
        });
        loginerr.value = 'Invalid username or password';
    }
};

</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.login-form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 15px;
}

label {
    font-weight: bold;
}

input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.btn-login {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-login:hover {
    background-color: #0056b3;
}

.error-message {
    color: red;
    margin-top: 10px;
}
</style>