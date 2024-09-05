import { defineStore } from 'pinia'

export const useAuthStore = defineStore({
  id: 'AuthStore',
  state: () => ({
    user: null,
    token: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
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

        this.user = data.user;
        this.token = data.token;
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
        }
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
        this.token = data.token;
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
        }
      } catch (error) {
        throw error.data;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      if (process.client) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    },
    async initializeUser() {
      if (process.client) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          this.user = JSON.parse(storedUser);
        }
      }
    },
    async updateUserDetails(updatedUserData) {
      try {
        const data = await $fetch('http://localhost:5000/api/v1/user/updateUser', {
          method: 'PUT',
          body: JSON.stringify(updatedUserData),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });

        return data;

      } catch (error) {
        throw error.data;
      }
    },
  },
  persist: true,
});