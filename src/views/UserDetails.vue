<template>
    <div >Hii This the User Details Page
        <div class="tableform">
            <table>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Mobile Number</th>
                    <th>Gender</th>
                    <th>Hobby</th>
                    <th>Address</th>
                    <th>Role</th>
                </tr>
                <tr v-for="(user, index) in data" :key="index">
                    <td>{{ user.fname }}</td> 
                    <td>{{ user.lname }}</td> 
                    <td>{{ user.email }}</td> 
                    <td>{{ user.phone }}</td> 
                    <td>{{ user.gender }}</td> 
                    <td>{{ user.Hobby }}</td> 
                    <td>{{ user.Address }}</td> 
                    <td>{{ user.Role }}</td> 
                </tr>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

const store = useAuthStore();
const data = ref([]);

onMounted(() => {
    fetchData();
});

const fetchData = () => {
    data.value = store.alluser; 
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.tableform {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
