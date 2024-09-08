import { useAuthStore } from '~/store/authStore';
import { useToast } from 'vue-toastification';

export default defineNuxtPlugin((nuxtApp) => {
   const authStore = useAuthStore();
   const config = useRuntimeConfig();
   const api = $fetch.create({
      baseURL: `${config.public.apiBaseUrl}`,
      onRequest({ request, options, error }) {
         if (authStore.token) {
            const headers = options.headers ||= {}
            if (Array.isArray(headers)) {
               headers.push(['Authorization', `Bearer ${authStore.token}`])
            } else if (headers instanceof Headers) {
               headers.set('Authorization', `Bearer ${authStore.token}`)
            } else {
               headers.Authorization = `Bearer ${authStore.token}`
            }
         }
      },
      async onResponseError({ response }) {
         if (response.status === 401) {
            const toast = useToast();

            toast.error('Your token has expired, redirecting to login page', {
               position: 'top-right',
               timeout: 3000,
               closeButton: 'button',
               icon: true,
               rtl: false,
            });

            authStore.logout();
            await nuxtApp.runWithContext(() => navigateTo('/login'))
         }
      }
   })

   return {
      provide: {
         api
      }
   }
})
