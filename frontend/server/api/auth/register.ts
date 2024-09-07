export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const body = await readBody(event);
    const user = await $fetch(`${config.public.apiBaseUrl}/auth/register`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return user;
    
  } catch (error) {
    throw error;
  }
});