<script lang="ts" setup>
import { useAuthStore } from '~/store/authStore';

const authStore = useAuthStore();

// Computed
const isLoggedIn = computed(() => authStore._isLoggedIn);

// watch(() => isLoggedIn.value, (newValue, oldValue) => {
//   console.log('Eski değer:', oldValue);
//   console.log('Yeni değer:', newValue);
// }, {
//   immediate: true
// });

// Methods
const logout = () => {
  authStore.logout();
};

</script>

<template>
  <nav class="navbar navbar-expand-md custom-nav">
    <div class="container">
      <NuxtLink class="navbar-brand" :to="`/`">Bostorek</NuxtLink>
      <ul class="navbar-nav">
        <li class="nav-item active">
          <NuxtLink class="nav-link pl-lg-0" :to="`/`">Home <span class="sr-only">(current)</span></NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink class="nav-link" :to="`/books`">Books</NuxtLink>
        </li>
        <li v-if="isLoggedIn" class="nav-item">
          <NuxtLink class="nav-link" :to="`/dashboard`">Dashboard</NuxtLink>
        </li>
        <li v-if="!isLoggedIn" class="nav-item">
          <NuxtLink class="nav-link" :to="`/login`">Login</NuxtLink>
        </li>
        <li v-if="!isLoggedIn" class="nav-item">
          <NuxtLink class="nav-link" :to="`/register`">Register</NuxtLink>
        </li>
        <li v-if="isLoggedIn" class="nav-item">
          <button class="nav-link" @click="logout">Logout</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.custom-nav {
  background-color: var(--primary-color);
  padding: 15px 0;
}

.navbar-brand {
  padding: 0;
  margin: 0;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

.nav-link {
  padding: 10px 15px !important;
  color: #fff;
  text-align: center;
}

.nav-link:hover {
  color: var(--secondary-color);
}

.active-link {
  color: var(--secondary-color);
}
</style>