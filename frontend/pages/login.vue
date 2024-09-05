<script setup>
import { useAuthStore } from "~/store/authStore";
import { useToast } from "vue-toastification";

const authStore = useAuthStore();
const router = useRouter();

const formData = reactive({
  email: "",
  password: "",
});
const showEmailWarningMessage = ref(false);
const showPasswordWarningMessage = ref(false);
const notFoundEmail = ref(null);
const isPasswordMatch = ref(true);
const toast = useToast();

const isEmailValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
});

const isPasswordValid = computed(() => {
  return formData.password.length >= 4 && formData.password.length <= 20;
});

const isFormValid = computed(() => {
  return isEmailValid.value && isPasswordValid.value;
});

const submitForm = async () => {
  try {
    await authStore.login(formData);
    toast.success("You will be redirected to the dashboard page", {
      position: "top-right",
      timeout: 3500,
      closeButton: "button",
      icon: true,
      rtl: false,
    });
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  } catch (errors) {
    const { error } = errors;

    if (error === "User not found!") {
      notFoundEmail.value = this.formData.email;
    } else if (error === "Your password is not true") {
      isPasswordMatch.value = false;
    }
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
      <div class="row justify-content-center mb-2 text-center">
        <div class="d-flex justify-content-center">
          <h1 class="display-3">Login</h1>
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
              autocomplete="on"
              :class="{
                'is-valid': isEmailValid,
                'is-invalid':
                  (!isEmailValid && showEmailWarningMessage) ||
                  notFoundEmail === formData.email,
              }"
              @focus="showEmailWarningMessage = true"
              @blur="showEmailWarningMessage = false"
              required
            />
            <span
              v-if="showEmailWarningMessage && !isEmailValid"
              class="text-danger small"
              >Please provide a valid email!</span
            >
            <span
              v-if="notFoundEmail === formData.email"
              class="text-danger small"
              >{{ `${notFoundEmail} is not found!` }}</span
            >
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
              :class="{
                'is-valid': isPasswordValid,
                'is-invalid':
                  (!isPasswordValid && showPasswordWarningMessage) ||
                  !isPasswordMatch,
              }"
              @focus="showPasswordWarningMessage = true"
              @blur="showPasswordWarningMessage = false"
              @input="isPasswordMatch = true"
              required
            />
            <span
              v-if="showPasswordWarningMessage && !isPasswordValid"
              class="text-danger small"
              >Password must be between 4 and 10 characters!</span
            >
            <span v-if="!isPasswordMatch" class="text-danger small"
              >Your password is not true!</span
            >
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