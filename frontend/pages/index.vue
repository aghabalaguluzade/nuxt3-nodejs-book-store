<script lang="ts" setup>
import Carousel from "~/components/widgets/Carousel.vue";
import hero_1 from "/public/images/hero_1.jpg";
import hero_2 from "/public/images/hero_2.jpg";
import hero_3 from "/public/images/hero_3.jpg";
import type { Book } from "~/types";

const carouselItems = [
  {
    imageUrl: hero_1,
    subtitle: "Liberte",
    title: "Lorem Ipsum Dolor Sit Amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    imageUrl: hero_2,
    subtitle: "Egalite",
    title: "Excepteur Sint Occaecat Cupidatat",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    imageUrl: hero_3,
    subtitle: "Fraternite",
    title: "Neque Porro Quisquam Est",
    description:
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
  },
];

const books = ref<Book[]>([]);
const selectedFilter = ref<'latest' | 'best'>('latest');
const openAccordionIndex = ref<number>(0);

// Fetching data
const { data, error } = await useFetch<Book[]>('/api/books');

if (error.value) {
  console.error('Error fetching books:', error.value.message);
} else {
  books.value = data.value || [];
}

// Methods
const selectFilter = (filter: 'latest' | 'best') => {
  selectedFilter.value = filter;
};


const toggleAccordion = (index: number) => {
  if(openAccordionIndex.value === index) {
    openAccordionIndex.value = -1;
  }else {
    openAccordionIndex.value = index;
  }
}

// Computed
const filteredBooks = computed(() => {
  const copiedBooks = [...books.value];

  if(selectedFilter.value === 'latest') {
    return copiedBooks
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }else if(selectedFilter.value === 'best') {
    return copiedBooks.sort((a, b) => b.rating - a.rating).slice(0, 4);
  }
});

</script>

<template>
  <div>
    <section class="mb-5">
      <carousel :items="carouselItems" height="400px" />
    </section>
    <section class="my-5">
      <div class="container">
        <SectionHeader
          title="Featured Books"
          text="We declare long prop names using camelCase because this avoids"
        />
        <div class="row">
          <div class="col-md-4">
            <div class="list-group">
              <button
                type="button"
                class="list-group-item list-group-item-action"
                :class="{ active: selectedFilter === 'latest' }"
                @click="selectFilter('latest')"
              >
                Latest Books
              </button>
              <button
                type="button"
                class="list-group-item list-group-item-action"
                :class="{ active: selectedFilter === 'best' }"
                @click="selectFilter('best')"
              >
                Best Ratings
              </button>
            </div>
          </div>
          <div class="col-md-8">
            <div class="accordion">
              <div
                class="accordion-item"
                v-for="(book, index) in filteredBooks"
                :key="index"
              >
                <h2 class="accordion-header">
                  <button
                    class="accordion-button"
                    type="button"
                    :class="{ collapsed: openAccordionIndex !== index }"
                    @click="toggleAccordion(index)"
                  >
                    <strong>{{ book.name }} - {{ book.author }}</strong>
                  </button>
                </h2>
                <div
                  class="accordion-collapse collapse"
                  :class="{ show: openAccordionIndex === index }"
                >
                  <div class="accordion-body">
                    <div class="row">
                      <div class="col-md-4">
                        <img src="/images/b1.jpg" class="img-fluid" />
                      </div>
                      <div
                        class="col-md-8 d-flex flex-column justify-content-center"
                      >
                        <p>{{ book.description }}</p>
                        <div
                          class="badge align-self-start"
                          style="background-color: var(--secondary-color)"
                        >
                          {{ book.rating }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- <book-categories />
    <book-about />
    <book-customers />
    <book-blog />
    <book-contact-us /> -->
  </div>
</template>

<style scoped>
.list-group-item.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}
.accordion-button {
  color: var(--primary-color);
}
.accordion-button:not(.collapsed) {
  background-color: var(--secondary-color);
  color: #ffffff;
}
.accordion-button:focus {
  outline: none;
  box-shadow: none;
}
</style>