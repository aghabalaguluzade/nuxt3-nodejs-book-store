import { defineStore } from 'pinia'
import type { User } from '~/types';

export const useAuthStore = defineStore({
  id: 'AuthStore',
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    isToken: (state) => !!state.token,
  },
  actions: {
    async register(newUser: User) {
      try {
        const data = await $fetch<{ user: User; token: string }>('/api/auth/register', {
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
      } catch (error: any) {
        throw error.data;
      }
    },
    async login(newUser: User) {
      try {
        const data = await $fetch<{ user: User; token: string, expiresIn: number }>('/api/auth/login', {
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
      } catch (error: any) {
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
  },
  persist: true,
});