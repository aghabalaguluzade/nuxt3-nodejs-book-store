import axios from 'axios';
import { useAuthStore } from '~/store/authStore';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

export default defineNuxtPlugin(nuxtApp => {
   const authStore = useAuthStore();
   const router = useRouter();
   const toast = useToast();

   axios.interceptors.response.use(
      response => response,
      error => {
         if (error.response && error.response.status === 401) {
            toast.error('Your token has expired, redirecting to login page', {
               position: 'top-right',
               timeout: 3000,
               closeButton: 'button',
               icon: true,
               rtl: false,
            });

            authStore.logout();
            router.push('/login');
         }
         return Promise.reject(error);
      }
   );

   nuxtApp.provide('axios', axios);
});
