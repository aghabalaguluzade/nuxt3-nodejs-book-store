import { defineStore } from 'pinia'

export const useAuthStore = defineStore({
  id: 'AuthStore',
  state: () => ({
    user: null, 
  }),
  getters: {
    _isLoggedIn: (state) => !!state.user
  },
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
    
        this.user = data.user;
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (error) {
        throw error.data;
      }
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
    },
  },
  persist: true
});