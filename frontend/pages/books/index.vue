<script setup>
import SectionHeader from '~/components/SectionHeader.vue';
import BookList from '~/components/BookList.vue';
import PaginationWidget from '~/components/widgets/PaginationWidget.vue';
import books from '~/db';

const currentPage = ref(1);
const itemsPerPage = ref(8);

const totalPages = computed(() => Math.ceil(books.length / itemsPerPage.value));
const paginatedBooks = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return books.slice(startIndex, endIndex);
});

const updatePage = (page) => {
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