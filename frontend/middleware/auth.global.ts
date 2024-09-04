import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware((to, from) => {
   if (process.client) {
      const authStore = useAuthStore();

      if (!authStore.user) {
         if (to.path === '/dashboard') {
            return navigateTo('/login');
         }
      }

      if (authStore.user) {
         if (to.path === '/login' || to.path === '/register') {
            return navigateTo({ name: 'dashboard' });
         }
      }

      // watch(() => authStore.user, (newValue, oldValue) => {
      //    console.log('Eski değer:', oldValue);
      //    console.log('Yeni değer:', newValue);
      //  }, {
      //    immediate: true
      //  });

   }
});