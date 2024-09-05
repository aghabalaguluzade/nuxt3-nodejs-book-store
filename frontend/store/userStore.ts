import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'UserStore',
  state: () => ({ }),
  actions: {
    async updateUserDetails(updatedUserData) {
      try {
        const data = $fetch('/api/user', {
          method: 'POST',
          body: JSON.stringify(updatedUserData),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        return data;

      } catch (error) {
        throw error.data;
      }
    },
  },
})
