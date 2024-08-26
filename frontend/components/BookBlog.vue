<template>
  <section class="blog_section layout_padding">
    <div class="container">
      <div class="heading_container heading_center">
        <h2>
          From Our Blog
        </h2>
      </div>
      <div class="row">
        <book-blog-item v-for="blog in 2" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import BookBlogItem from './BookBlogItem.vue';

</script>

<style>

</style>