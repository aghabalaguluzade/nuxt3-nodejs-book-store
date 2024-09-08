<script setup>
import { useBookStore } from "./store/bookStore";
import { useAuthStore } from "./store/authStore";
import axios from "axios";

const storeBooks = useBookStore();
const authStore = useAuthStore();

// Fetch the books
storeBooks.getBooks();

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error, "ERROR");
    if (error.response && error.response.status === 401) {
      toast.error("Your token has expired, redirecting to login page", {
        position: "top-right",
        timeout: 3000,
        closeButton: "button",
        icon: true,
        rtl: false,
      });
      setTimeout(() => {
        authStore.logout();
        router.push("/login");
      }, 3000);
    }
    return Promise.reject(error);
  }
);

</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
a {
  text-decoration: none;
}
</style>
