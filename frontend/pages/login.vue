<script setup>
import { useAuthStore } from "~/store/authStore";

const authStore = useAuthStore();

const formData = reactive({
  email: "",
  password: "",
});
const errors = ref('');

const submitForm = async () => {
  try {
    await authStore.login(formData);
    console.log("Login successful");
  } catch (error) {
    errors.value = error;
    console.log(error);
  }
};
</script>

<template>
  <section class="full-section-height">
    <Head>
      <Title>Login</Title>
      <Meta name="description" content="Login" />
    </Head>
    <div class="container">
      <div class="row justify-content-center mb-2"> 
        <div class="col-md-6 col-8 mb-3 text-center">
          <h1>Login</h1>
        </div>
      </div>
      <div v-if="errors" class="row justify-content-center mb-4 mt-0"> 
        <div class="col-md-6 col-8 bg-danger text-white text-center">
          {{ errors?.data?.error }}
        </div>
      </div>
      <form @submit.prevent="submitForm">
        <div class="row justify-content-center">
          <!-- Email Field (Medium and Larger Screens) -->
          <div class="col-md-6 col-8 mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              name="email"
              v-model.trim="formData.email"
              required
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="row justify-content-center">
          <div class="col-md-6 col-8 mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              name="password"
              v-model.trim="formData.password"
              required
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="row justify-content-center">
          <div class="col-md-6 col-8 mb-3">
            <button type="submit" class="btn btn-primary w-100">Login</button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>
