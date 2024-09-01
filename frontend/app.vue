<script setup>
import { useBookStore } from './store/bookStore';

const storeBooks = useBookStore();
// Fetch the books
storeBooks.getBooks();
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