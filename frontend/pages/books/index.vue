<script setup lang="ts">
import SectionHeader from '~/components/SectionHeader.vue';
import BookList from '~/components/BookList.vue';
import PaginationWidget from '~/components/widgets/PaginationWidget.vue';
import type { Book } from '~/types';

const books = ref<Book[]>([]);
const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(8);

const totalPages = computed(() => Math.ceil(books.value.length / itemsPerPage.value));
const paginatedBooks = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return books.value.slice(startIndex, endIndex);
});

// Fetching data
const { data, error } = await useFetch<Book[]>('/api/books');

if (error.value) {
  console.error('Error fetching books:', error.value.message);
} else {
  books.value = data.value || [];
}

const updatePage = (page: number) => {
  currentPage.value = page;
};

</script>

<template>
  <div class="container">
    <section-header 
      title="Books"
      text="We declare long prop names using camelCase because this avoids"
    />
    <book-list :books="paginatedBooks" />
    <pagination-widget 
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-changed="updatePage"
    />
  </div>
</template>

<style scoped>
.auth-box {
  margin-top: -30px;
}
</style>