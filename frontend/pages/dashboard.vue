<script setup>
import { useAuthStore } from '~/store/authStore';

const userStore = useAuthStore();

</script>

<template>
  <div>
    <h1>{{ userStore.user?.username }}</h1>
    <h2>{{ userStore.user?.email }}</h2>
  </div>
</template>