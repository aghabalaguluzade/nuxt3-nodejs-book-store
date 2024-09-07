import { useAuthStore } from '~/store/authStore';

export default defineEventHandler(async (event) => {
  const authStore = useAuthStore();

  try {
    const config = useRuntimeConfig();
    const response = await $fetch(`${config.public.apiBaseUrl}/books/uploader`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.$state.token}`
      },
    });

    return response;

  } catch (error) {
    throw createError({ statusCode: 500, message: 'Internal Server Error' });
  }
});