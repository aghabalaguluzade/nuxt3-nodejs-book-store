<script setup>
import { useAuthStore } from '~/store/authStore';

const authStore = useAuthStore();

const formData = reactive({
  username: '',
  email: '',
  password: ''
});
const errors = ref('');

const submitForm = async () => {
  try {
    await authStore.register(formData);
    console.log('Register successful');
  } catch (error) {
    errors.value = error;
    console.log(error);
  }
};
</script>

<template>
  <section class="full-section-height">
    <Head>
      <Title>Register</Title>
      <Meta name="description" content="Register" />
    </Head>
    <div class="container">
      <div class="row justify-content-center mb-2 text-center">
        <div class="col-md-6 col-8 mb-3">
          <h1>Register</h1>
        </div>
      </div>
      <div v-if="errors" class="row justify-content-center mb-4 mt-0"> 
        <div class="col-md-6 col-8 bg-danger text-white text-center">
          {{ errors?.data?.error }}
        </div>
      </div>
      <form @submit.prevent="submitForm">
        <div class="row justify-content-center">
          <!-- Username Field (Medium and Larger Screens) -->
          <div class="col-md-6 col-8 mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" id="username" name="username" v-model.trim="formData.username" required>
          </div>
        </div>

        <div class="row justify-content-center">
          <!-- Email Field (Medium and Larger Screens) -->
          <div class="col-md-6 col-8 mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" v-model.trim="formData.email" required>
          </div>
        </div>

        <!-- Password Field -->
        <div class="row justify-content-center">
          <div class="col-md-6 col-8 mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" name="password" v-model.trim="formData.password" required>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="row justify-content-center">
          <div class="col-md-6 col-8 mb-3">
            <button type="submit" class="btn btn-primary w-100">Register</button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>
