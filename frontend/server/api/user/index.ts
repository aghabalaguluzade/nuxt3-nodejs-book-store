export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log(event, 'event'); 
    const user = await $fetch('http://127.0.0.1:5000/api/v1/user/updateUser', {
      method: 'PUT',
      body,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return user;

  } catch (error) {
    throw error;
  }
})