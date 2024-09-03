import { defineStore } from 'pinia'

export const useAuthStore = defineStore({
  id: 'AuthStore',
  state: () => ({
    user: null
  }),
  actions: {
    async register(newUser) {
      try {
        const data = await $fetch('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(newUser),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        this.user = data;
        console.log(data);

      } catch (error) {
        throw error.data;
      }
    },
    async login(newUser) {
      try {
        const data = await $fetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify(newUser),
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        this.user = data;
        console.log(data);
    
      } catch (error) {
        throw error.data;
      }
    }
  }
});
