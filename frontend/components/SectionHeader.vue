<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="text-center mb-5 mt-3">
    <h1 class="display-4 font-weight-bolder">{{ title }}</h1>
    <p class="lead">{{ text }}</p>
  </div>
</template>