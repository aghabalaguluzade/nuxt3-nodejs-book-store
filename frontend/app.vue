<script setup>
import { useBookStore } from "./store/bookStore";
import { useCommentsStore } from "./store/commentsStore";

const storeBooks = useBookStore();
const commentsStore = useCommentsStore();

// Fetch the books
onMounted(() => {
  storeBooks.getBooks();
  commentsStore.fetchComments();
});
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
