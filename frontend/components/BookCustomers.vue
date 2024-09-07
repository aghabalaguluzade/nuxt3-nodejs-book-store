<template>
  <section class="client_section layout_padding">
    <div class="container ">
      <div class="heading_container heading_center">
        <h2>
          What Says Customers
        </h2>
        <hr>
      </div>
      <div class="row">
        <book-customer v-for="(customer,index) in 3" :key="index" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>

</script>

<style>

</style>