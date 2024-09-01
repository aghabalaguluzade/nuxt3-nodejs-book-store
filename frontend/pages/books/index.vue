<script setup lang="ts">
import PaginationWidget from '~/components/widgets/PaginationWidget.vue';
import { useBookStore } from '~/store/bookStore';

const bookStore = useBookStore();

const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(8);

// Methods
const updatePage = (page: number) => {
  currentPage.value = page;
};

// Computed
const totalPages = computed(() => Math.ceil(bookStore.books.length / itemsPerPage.value));
const paginatedBooks = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return bookStore.books.slice(startIndex, endIndex);
});

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