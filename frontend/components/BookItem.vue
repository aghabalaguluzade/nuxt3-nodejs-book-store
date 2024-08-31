<script setup>
const props = defineProps({
  book: {
    type: Object,
    default: () => ({})
  }
});

const ratingBadgeClass = computed(() => {
  if(props.book.rating > 7) {
    return 'bg-success';
  }else if(props.book.rating > 4) {
    return 'bg-warning';
  }else {
    return 'bg-danger';
  }
});

const truncatedText = computed(() => {
  if(props.book.description.length > 80) {
    return props.book.description.slice(0, 80) + '...';
  }

  return props.book.description;
});


</script>

<template>
  <NuxtLink :to="`/books/${book._id}`">
    <div class="card border-0 shadow position-relative">
      <img src="../public/images//b1.jpg" class="card-img-top" alt="card-img-top" />
      <div class="card-body">
        <div class="auth-box">
          <span style="background-color: var(--primary-color);" class="py-1 px-3 text-white rounded-pill">
            {{ book.author }}
          </span>
        </div>
        <h5 class="card-title mt-3 fw-semibold">{{ book.name }}</h5>
        <p class="card-text">{{ truncatedText }}</p>
        <div class="d-flex justify-content-between align-items-center">
          <p>Read More</p>
          <p style="background-color: var(--primary-color);" class="py-1 px-2 text-white badge mb-0">{{ book.uploadDate }}</p>
        </div>
      </div>
      <span
        :class="ratingBadgeClass"
        class="position-absolute top-0 start-100 translate-middle p-2 text-light rounded-circle border border-2 border-light custom-center"
      >
        {{ book.rating }}
      </span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.card-text {
  min-height: 70px;
}
.custom-center {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.primary { 
  background-color: #063547;
}
</style>