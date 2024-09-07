import { useAuthStore } from '~/store/authStore';

export default defineNuxtRouteMiddleware((to, from) => {
   const authStore = useAuthStore();

   if (!authStore.isLoggedIn && to.path === '/dashboard') {
      return navigateTo('/login');
   }

   if(!authStore.isToken && to.path === '/dashboard') {
      return navigateTo('/login');
   }

   if (authStore.isLoggedIn && authStore.isToken && (to.path === '/login')) {
      return navigateTo('/dashboard');
   }
});
