<script lang="ts" setup>

</script>

<template>
  <div>
    <section class="catagory_section layout_padding">
      <div class="catagory_container">
        <div class="container ">
          <div class="heading_container heading_center">
            <h2>
              Books Categories
            </h2>
            <p>
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration
            </p>
          </div>
          <div class="row">
            <book-category-item v-for="category in 6" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style>

</style>