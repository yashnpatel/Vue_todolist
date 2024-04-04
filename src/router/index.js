import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('../views/HomeView.vue');
const Registration = () => import('../views/RegistrationCom.vue');
const Dashboard = () => import('../views/DashBord.vue');
const NotFound = () => import('../views/NotFound.vue');
const Login = () => import('../views/LoginCom.vue');
const Task = () => import('../views/TaskJ.vue');
const Updateprofile = () => import('../views/UserProfile.vue');
const WelcomePage = ()=> import('../views/WelCome.vue');
const AdminPage = () => import('../views/AdminDashbord.vue');
const Users = () => import('../views/UserDetails.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true } 
    },
    {
      path: '/', 
      name: 'Login',
      component: Login
    },
    {
      path: '/Registration',
      name: 'Registration',
      component: Registration,
    },
    {
      path: '/dashbord',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true, transition: 'slide-left' }
    },
    {
      path: '/Users',
      name: 'Users',
      component: Users,
      meta: { requiresAuth: true, transition: 'slide-left', requiresAdmin: true }
    },
    {
      path: '/task',
      name: 'Task',
      component: Task,
      meta: { requiresAuth: true }
    },
    {
      path: '/Welcome',
      name: 'Welcome',
      component: WelcomePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/Updateprofile',
      name: 'Updateprofile',
      component: Updateprofile,
      meta: { requiresAuth: true, transition: 'slide-right'}
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/admin',
      name: 'AdminPage',
      component: AdminPage,
      meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin' }
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFound,
      meta: { requiresAuth: true, title: 'Not Found' }
    },
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    alert("Please Login");
    next('/');
  } else if (to.name === 'Login' &&  isAuthenticated()) {
    next('/Welcome');
  }else if(to.name =='Registration' && isAuthenticated()){
    next('/Welcome');
  } 
  else if (to.meta.requiresAdmin && !isAdmin()) {
    alert("You are not authorized to access this page");
    next('/');
  } else {
    next();
  }
});

const isAdmin = () => {
  const role = localStorage.getItem('Role');
  return role === 'Admin';
}

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
}

export default router;
