<script setup lang="ts">
import { Book } from "~/types/index";

const defaultProps = defineProps({
  books: {
    type: Array as () => Book[],
    default: () => []
  }
});
</script>

<template>
  <div class="row">
    <div class="col-md-6 col-md-5 col-xl-3 mb-5" v-for="book in books" :key="book.id">
      <book-item :book="book" />
    </div>
  </div>
</template>