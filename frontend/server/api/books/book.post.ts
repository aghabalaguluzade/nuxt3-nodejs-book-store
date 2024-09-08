import { useNuxtApp } from "nuxt/app";
import { useAuthStore } from "~/store/authStore";

export default defineEventHandler(async (event) => {
  const authStore = useAuthStore();
  
  try {
    const body = await readBody(event);
    const config = useRuntimeConfig();
    const response = await $fetch(`${config.public.apiBaseUrl}/books`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.$state.token}`
      }
    });

    return response;
    
  } catch (error) {
    throw error.data;
  }
})