import { defineStore } from 'pinia'
import { useAuthStore } from './authStore';
import type { Book } from '~/types';

export const useUserStore = defineStore({
  id: 'UserStore',
  state: () => ({}),
  actions: {
    async updateUserDetails(updatedUserData: Book) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const { $api } = useNuxtApp()
      try {
        const data = await $api(`${config.public.apiBaseUrl}/user/updateUser`, {
          method: 'PUT',
          body: JSON.stringify(updatedUserData),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          }
        });

        return data;

      } catch (error) {
        throw error.data;
      }
    },
  },
})
