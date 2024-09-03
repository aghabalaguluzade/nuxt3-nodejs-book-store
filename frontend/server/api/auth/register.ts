export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const user = await $fetch('http://localhost:5000/api/v1/auth/register', {
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