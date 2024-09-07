<script setup lang="ts">
import { useAuthStore } from "~/store/authStore";
import { useUserStore } from "~/store/userStore";
import { useToast } from "vue-toastification";
import type { User } from "~/types";

// Use Nuxt App and Stores
const authStore = useAuthStore();
const userStore = useUserStore();
const toast = useToast();
const router = useRouter();

// Reactive state for user info
const userInfo = reactive<User>({
  username: "",
  email: "",
  password: "",
});
const editMode = ref<boolean>(false);

// Methods
const toggleEditMode = () => {
  editMode.value = !editMode.value;
};

const cancelEditMode = () => {
  editMode.value = !editMode.value;
  if (authStore.user) {
    userInfo.username = authStore.user.username;
    userInfo.email = authStore.user.email;
    userInfo.password = "";
  }
};

const saveUserInfo = async () => {
  try {
    await userStore.updateUserDetails(userInfo);
    toast.success("Please login with new details", {
      position: "top-right",
      timeout: 3500,
      closeButton: "button",
      icon: true,
      rtl: false,
    });
    setTimeout(() => {
      authStore.logout();
      router.push("/");
    }, 1000);
  } catch (error) {
    console.log(error);
  }
};

// Lifecycle hook
onMounted(() => {
  if (authStore.user) {
    userInfo.username = authStore.user.username;
    userInfo.email = authStore.user.email;
  }
});
</script>

<template>
  <div class="row">
    <div class="col-lg-6">
      <h2 class="mb-4">User Information</h2>
      <form>
        <div class="mb-3">
          <label for="username">Username</label>
          <input
            v-model="userInfo.username"
            type="text"
            id="username"
            class="form-control"
            :disabled="!editMode"
          />
        </div>
        <div class="mb-3">
          <label for="email">Email</label>
          <input
            v-model="userInfo.email"
            type="email"
            id="email"
            class="form-control"
            :disabled="!editMode"
          />
        </div>
        <div class="mb-3">
          <label for="password">Password</label>
          <input
            v-model="userInfo.password"
            type="password"
            id="password"
            class="form-control"
            :disabled="!editMode"
          />
        </div>
        <button
          @click="!editMode ? toggleEditMode() : saveUserInfo()"
          type="button"
          class="btn btn-primary"
        >
          {{ editMode ? "Save" : "Edit" }}
        </button>
        <button
          v-if="editMode"
          style="
            background-color: #ecc73c !important;
            border-color: #ecc73c !important;
          "
          @click="cancelEditMode"
          type="button"
          class="btn btn-primary ms-3"
        >
          Cancel
        </button>
      </form>
    </div>
    <div class="col-lg-6"></div>
  </div>
</template>
