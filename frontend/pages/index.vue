<script lang="ts" setup>
import CarouselWidget from "~/components/widgets/CarouselWidget.vue";
import { useBookStore } from "~/store/bookStore";
import { useCommentsStore } from "~/store/commentsStore";
import hero_1 from "/public/images/hero_1.jpg";
import hero_2 from "/public/images/hero_2.jpg";
import hero_3 from "/public/images/hero_3.jpg";
import type { Book, CarouselItem } from "~/types";

// Stores and Utilities
const bookStore = useBookStore();
const commentsStore = useCommentsStore();
const { $backendImagesUrl } = useNuxtApp();

// Carousel
const carouselItems: CarouselItem[] = [
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

const selectedFilter = ref<"latest" | "best">("latest");
const openAccordionIndex = ref<number>(0);

// Methods
const selectFilter = (filter: "latest" | "best") => {
  selectedFilter.value = filter;
};

const toggleAccordion = (index: number) => {
  if (openAccordionIndex.value === index) {
    openAccordionIndex.value = -1;
  } else {
    openAccordionIndex.value = index;
  }
};

// Computed
const filteredBooks = computed<Book[]>(() => {
  const copiedBooks = [...bookStore.books];

  if (copiedBooks.length === 0) {
    return [];
  }

  if (selectedFilter.value === "latest") {
    return bookStore.latest5Books;
  } else if (selectedFilter.value === "best") {
    return bookStore.rated5Books;
  }

  return [];
});

const prepared5Comments = computed(() => {
  const latest5Comments = commentsStore.comments
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return latest5Comments.map((comment) => {
    const correspondingBook = bookStore.books.find(
      (book) => book._id === comment.book
    );

    if (correspondingBook) {
      return {
        ...comment,
        name: correspondingBook.name,
      };
    }

    return comment;
  });
});

const calculateAverageRating = (ratings) => {
  if (!Array.isArray(ratings) || ratings.length === 0) {
    return "0.0";
  }

  const totalRating = ratings.reduce((sum, rating) => sum + rating.rate, 0);
  return (totalRating / ratings.length).toFixed(1);
};

const averageRatings = computed(() => {
  const books = filteredBooks.value;

  if (!Array.isArray(books)) {
    return [];
  }

  return books.map(book => ({
    ...book,
    averageRating: calculateAverageRating(book.ratings || [])
  }));
});

</script>

<template>
  <div>
    <section class="mb-5">
      <carousel-widget :items="carouselItems" height="400px" />
    </section>
    <section class="my-5">
      <div class="container">
        <SectionHeader
          title="Featured Books"
          text="These are the featured books"
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
            <div
              v-if="bookStore.isLoading"
              class="d-flex justify-content-center"
            >
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div class="accordion">
              <div
                class="accordion-item"
                v-for="(book, index) in averageRatings"
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
                        <NuxtLink :to="`books/${book._id}`">
                          <img
                            :src="`${$backendImagesUrl}/${book.image}`"
                            class="img-fluid"
                          />
                        </NuxtLink>
                      </div>
                      <div
                        class="col-md-8 d-flex flex-column justify-content-center"
                      >
                        <p>{{ book.description }}</p>
                        <div
                          class="badge align-self-start"
                          style="background-color: var(--secondary-color)"
                        >
                          {{ book.averageRating }}
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
    <section class="py-5" style="background-color: #f5f6f9">
      <div class="container">
        <SectionHeader
          title="Latest Comments"
          text="These are the latest comments"
        />

        <div class="row d-flex justify-content-center">
          <div
            class="col-md-6"
            v-for="comment in prepared5Comments"
            :key="comment._id"
          >
            <div class="card mb-3">
              <div class="card-body">
                <div class="d-flex flex-start align-items-center">
                  <img
                    class="rounded-circle shadow-1-strong me-3"
                    src="../public/images/c1.jpg"
                    alt="avatar"
                    width="60"
                    height="60"
                  />
                  <div>
                    <h6 class="fw-bold text-primary mb-1">
                      {{ comment.name }}
                    </h6>
                    <p class="text-muted small mb-0">
                      {{ comment.postedBy.username }} -
                      {{ $formatDate(comment.createdAt) }}
                    </p>
                  </div>
                </div>

                <p class="mt-3 mb-4 pb-2">
                  {{ comment.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
