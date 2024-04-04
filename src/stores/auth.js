
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    alluser: [],
    user: [],
    isAuthenticated: false,
    tasks: [],
    role: null,
  }),
  getters: {
    getUser: (state) => state.user,
    getallusers: (state) => state.alluser,
    getIsAuthenticated: (state) => state.isAuthenticated,
    getTasks: (state) => state.tasks,
    getRole: (state) => state.role,
  },
  actions: {
    isAdmin () {
      return role === 'admin';
    },
    async login({ username, password }) {
      try {
        const response = await axios.get('http://localhost:3000/register');
        const registerData = response.data;
        this.alluser = response.data
        if (!Array.isArray(registerData)) {
          throw new Error('Invalid response data');
        }

        const user = registerData.find(user => user.email === username);

        if (user && user.password === password) {
          this.user = user;
          this.role = user.Role;
          this.isAuthenticated = true;

          localStorage.setItem("userid", this.user.id);
        } else {
          throw new Error('Invalid username or password');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        this.isAuthenticated = false;
        throw error;
      }
    },
    async fetchUserData() {
      try {
        const storedUserId = localStorage.getItem('userid');
        if (!storedUserId) {
          throw new Error('User ID not found in local storage');
        }

        const response = await axios.get(`http://localhost:3000/register/${storedUserId}`);
        const userData = response.data;

        if (userData) {
          this.user = userData;
          console.log('User data fetched successfully:', this.user);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
    },
    async fetchTaskData() {
      try {
        const storedUserId = localStorage.getItem('userid');
        if (!storedUserId) {
          throw new Error('User ID not found in local storage');
        }

        const response = await axios.get(`http://localhost:3000/task?userID=${storedUserId}`);
        const taskData = response.data
        this.tasks = taskData;
        console.log(taskData)
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
    },

    async register(userData) {
      try {
        const response = await axios.post('http://localhost:3000/register', userData);
        if (response.data) {
          this.user = response.data;
          this.isAuthenticated = true;
        } else {
          console.error('Registration failed');
        }
      } catch (error) {
        console.error('Error registering:', error);
      }
    },
    async updateProfile(userData) {
      try {
        this.user = userData
        const response = await axios.put(`http://localhost:3000/register/${this.user.id}`, userData);
        if (response.data) {
          this.user = response.data;
          return response.data;
        } else {
          console.error('Update failed');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    },
    async createTask(taskData) {
      try {
        this.tasks.push(taskData);
        const response = await axios.post(`http://localhost:3000/task/`, taskData);
        console.log(response)
        
        return response.data;
      } catch (error) {
        console.error('Error creating task:', error);
        throw error;
      }
    },
    async updateTaskStatus(id, newStatus, date) {
      try {
        console.log(date)
        const taskToUpdate = this.tasks.find((s)=>s.id==id)
        console.log(taskToUpdate)
        if (taskToUpdate) {
          taskToUpdate.status = newStatus;
          const response = await axios.patch(`http://localhost:3000/task/${id}`, {status:newStatus, Date:date});
          const Updatetask = response.data;
          return Updatetask;
        } else {
          throw new Error('Task not found');
        }
      } catch (error) {
        console.error('Error updating task status:', error);
        throw error;
      }
    },
    async updateTaskTitle(id, newtitle) {
      console.log(id)
      try {
        const taskToUpdate = this.tasks.find((s)=>s.id==id)
        console.log(taskToUpdate)
        if (taskToUpdate) {
          taskToUpdate.title = newtitle.title;
          taskToUpdate.description = newtitle.description;
          const response = await axios.patch(`http://localhost:3000/task/${id}`, {title:newtitle.title,description:newtitle.description,UpdatedDate:newtitle.UpdatedDate});
          const updatedTask = response.data;
          console.log(response)
          return updatedTask;
        } else {
          throw new Error('Task not found');
        }
      } catch (error) {
        console.error('Error updating task status:', error);
        throw error;
      }
    },
    async removeTask(taskId) {
      try {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
          throw new Error('Task not found');
        }
        console.log(this.tasks)
        this.tasks.splice(taskIndex, 1);
        console.log(this.tasks)
        const response = await axios.delete(`http://localhost:3000/task/${taskId}`);

        return response.data;
      } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.task = null;
    },
    getUserDetail() {
      return this.user;
    }


  }
});


