import { useAuthStore } from '~/store/authStore';

export default defineNuxtRouteMiddleware((to, from) => {
   const authStore = useAuthStore();

   if (!authStore.isLoggedIn && (to.path === '/dashboard' || to.path === '/profile')) {
      return navigateTo('/login');
   }

   if (authStore.isLoggedIn && (to.path === '/login' || to.path === '/register')) {
      return navigateTo('/dashboard');
   }
});
