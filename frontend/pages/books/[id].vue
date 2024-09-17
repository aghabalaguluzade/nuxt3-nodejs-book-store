<script setup lang="ts">
import { useBookStore } from "~/store/bookStore";
import { useAuthStore } from "~/store/authStore";
import { useCommentsStore } from "~/store/commentsStore";
import { useRatingStore } from "~/store/ratingStore";
import type { Book } from "~/types";
import { useRoute, useRouter, useHead } from "#app";
import { computed, nextTick, ref, watch } from "vue";

const route = useRoute();
const router = useRouter();
const storeBooks = useBookStore();
const authStore = useAuthStore();
const commentsStore = useCommentsStore();
const ratingStore = useRatingStore();
const { $backendImagesUrl } = useNuxtApp();

const book = ref<Book>({
  name: "",
  author: "",
  description: "",
  page: null,
  image: "",
  updatedAt: null,
});
const loading = ref<boolean>(true);
const commentContent = ref<string | null>("");
const userRate = ref<number | null>(null);

// Methods
const addComment = async () => {
  try {
    const bookId = route.params.id as string;
    const content = commentContent.value;
    const userId = authStore.user._id;

    await commentsStore.addNewComment({
      bookId,
      content,
      userId,
    });

    await commentsStore.fetchCommentsForBook(route.params.id as string);

    commentContent.value = null;
  } catch (error) {
    console.log(error);
  }
};

const addRate = async () => {
  try {
    const bookId = route.params.id;
    const rate = userRate.value;
    const userId = authStore.user._id;

    await ratingStore.addNewRate({
      bookId,
      userId,
      rate,
    });

    userRate.value = null;

    await ratingStore.fetchRatingsForBook(route.params.id as string);
  } catch (error) {
    console.error(error);
  }
};

const upvote = async (commentId: string) => {
  try {
    await commentsStore.upvoteComment(commentId);

    await commentsStore.fetchCommentsForBook(route.params.id as string);
  } catch (error) {
    console.error(error);
  }
};

const downvote = async (commentId: string) => {
  try {
    await commentsStore.downvoteComment(commentId);

    await commentsStore.fetchCommentsForBook(route.params.id as string);
  } catch (error) {
    console.error(error);
  }
};

const selectBook = async () => {
  const bookId = route.params.id as string;
  const bookData = storeBooks.selectedBook(bookId);
  
  // book.value = bookData;
  // loading.value = false;

  if (bookData) {
    book.value = bookData;
    loading.value = false;
  } else {
    try {
      await storeBooks.getBooks();
      const updatedBookData = storeBooks.selectedBook(bookId);
      if (updatedBookData) {
        book.value = updatedBookData;
      }
    } catch (error) {
      console.error("Error selecting book:", error);
    } finally {
      loading.value = false;
    }
  }
};

const averageRating = computed(() => {
  if (ratingStore.ratingsForBook.length > 0) {
    const totalRating = ratingStore.ratingsForBook.reduce(
      (sum: any, rating: { rate: any }) => sum + rating.rate,
      0
    );

    return (totalRating / ratingStore.ratingsForBook.length).toFixed(1);
  }
});

const ratingCount = computed(() =>
  ratingStore.ratingsForBook ? ratingStore.ratingsForBook.length : 0
);

const isUserAlreadyRated = computed(() => {
  if (authStore.user) return false;

  return ratingStore.ratingsForBook.some(
    (rating) => rating.ratedBy._id == authStore.user
  );
});

const userRating = computed(() => {
  const userRatingObject = ratingStore.ratingsForBook.find(
    (rating) => rating.ratedBy._id === authStore.user
  );

  return userRatingObject ? userRatingObject : null;
});

const scrollToComment = () => {
  nextTick(() => {
    const commentId = route.query.comment as string;
    if (commentId) {
      const element = document.getElementById(`comment-${commentId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.error(`Element with id comment-${commentId} not found`);
      }
    }
  });
};

const goToBackBooks = () => {
  router.push("/books");
};

// Computed
const isLoggedIn = computed(() => authStore.isLoggedIn);
const commentsForBook = computed(() => commentsStore.commentsForBook);

onMounted(() => {
  selectBook();
  commentsStore.fetchCommentsForBook(route.params.id as string);
  ratingStore.fetchRatingsForBook(route.params.id as string);
});

// Watcher
watch(
  () => commentsStore.commentsForBook,
  (newComments) => {
    if (newComments.length) {
      scrollToComment();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="container">
    <Head>
      <Title>{{ book?.name }}</Title>
      <Meta name="description" :content="book?.description" />
    </Head>
    <SectionHeader :title="book.name" :text="book.author" />
    <div class="d-flex">
      <font-awesome
        icon="arrow-left"
        size="xl"
        class="mb-2"
        style="cursor: pointer; color: var(--secondary-color)"
        @click="goToBackBooks"
      />
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="image-box">
          <img
            class="img-fluid"
            :src="`${$backendImagesUrl}/${book.image}`"
            style="height: 338px; width: 456px; object-fit: fill"
          />
        </div>
      </div>
      <div class="col-md-6">
        <div class="d-flex flex-column h-100 justify-content-between">
          <div class="mb-3">
            <p>
              {{ book.description }}
            </p>
          </div>
          <div class="d-flex flex-column">
            <div class="row border-bottom pb-2">
              <div class="col-lg-6"><strong>Page</strong></div>
              <div class="col-lg-6">{{ book.page }}</div>
            </div>
            <div class="row border-bottom pb-2">
              <div class="col-lg-6"><strong>Rating</strong></div>
              <div class="col-lg-6">
                {{ averageRating }} - ({{ ratingCount }} rates)
              </div>
            </div>
            <div class="row border-bottom pb-2">
              <div class="col-lg-6"><strong>Upload Date</strong></div>
              <div class="col-lg-6">{{ $formatDate(book.updatedAt) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-md-6">
        <div class="box">
          <div v-if="isLoggedIn">
            <div v-if="!isUserAlreadyRated">
              <h3 style="color: var(--primary-color)">Rate The Book</h3>
              <form @submit.prevent="addRate">
                <!-- Rating Input -->
                <div class="mb-3">
                  <input
                    type="number"
                    id="rating"
                    class="form-control w-50"
                    min="1"
                    max="10"
                    placeholder="Rate (1-10)"
                    required
                    v-model="userRate"
                  />
                </div>

                <!-- Submit Button -->
                <button type="submit" class="btn btn-primary">Rate</button>
              </form>
            </div>

            <!-- Submit Button -->
            <div v-else>Your Rate: {{ userRating }}</div>
          </div>

          <NuxtLink v-else to="/login">
            <p style="color: var(--secondary-color)">
              Log in to leave a rate for the book
            </p>
          </NuxtLink>
        </div>
      </div>
    </div>
    <hr v-if="isLoggedIn" />
    <div class="row mt-3">
      <div class="col-md-12">
        <div class="box">
          <div v-if="isLoggedIn">
            <h3 style="color: var(--primary-color)">Comment The Book</h3>
            <form @submit.prevent="addComment">
              <!-- Comment Text Area -->
              <div class="mb-3">
                <textarea
                  id="comment"
                  class="form-control"
                  rows="4"
                  placeholder="Enter your comment"
                  required
                  v-model="commentContent"
                ></textarea>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="btn btn-primary">Comment</button>
            </form>
          </div>

          <NuxtLink v-else to="/login">
            <p style="color: var(--secondary-color)">
              Log in to leave a comment
            </p>
          </NuxtLink>
        </div>
      </div>
    </div>
    <hr />
    <div class="row my-3">
      <div class="col-md-12">
        <div class="box">
          <h3 style="color: var(--primary-color)">Comments</h3>
          <div>
            <div
              class="card mb-4"
              v-for="comment in commentsForBook"
              :key="comment._id"
            >
              <div class="card-body" :id="`comment-${comment._id}`">
                <div class="d-flex align-items-center justify-content-between">
                  <p class="comment-content mb-0">
                    {{ comment.content }}
                  </p>
                  <p class="comment-date mb-0 text-muted">
                    {{ $formatDate(comment.createdAt) }}
                  </p>
                </div>

                <div class="d-flex justify-content-between mt-3">
                  <div class="d-flex flex-row align-items-center">
                    <p class="small mb-0 ms-2">
                      {{ comment.postedBy.username }}
                    </p>
                  </div>
                  <div
                    class="d-flex flex-row align-items-center"
                    style="gap: 10px"
                  >
                    <div
                      class="d-flex flex-row align-items-center"
                      style="gap: 10px"
                      v-if="!authStore.$state.user"
                    >
                      <p class="small mb-0">Login for upvote!</p>
                      <font-awesome
                        :icon="['fas', 'thumbs-up']"
                        style="color: var(--secondary-color)"
                      />
                    </div>
                    <div
                      class="d-flex flex-row align-items-center"
                      style="gap: 10px; cursor: pointer"
                      v-else-if="
                        !comment.upvotes.includes(authStore.$state.user._id) &&
                        comment.postedBy._id !== authStore.$state.user._id
                      "
                      @click="upvote(comment._id)"
                    >
                      <p class="small mb-0">Upvote?</p>
                      <font-awesome :icon="['far', 'thumbs-up']" />
                    </div>
                    <div
                      class="d-flex flex-row align-items-center"
                      style="gap: 10px; cursor: pointer"
                      v-else-if="
                        comment.upvotes.includes(authStore.$state.user._id) &&
                        comment.postedBy._id !== authStore.$state.user._id
                      "
                      @click="downvote(comment._id)"
                    >
                      <p class="small mb-0">Upvoted</p>
                      <font-awesome
                        :icon="['fas', 'thumbs-up']"
                        style="color: var(--secondary-color)"
                      />
                    </div>

                    <div
                      v-else
                      class="d-flex flex-row align-items-center"
                      style="gap: 10px"
                    >
                      <p class="small mb-0">
                        You can't upvote for your comment
                      </p>
                      <font-awesome
                        :icon="['fas', 'thumbs-up']"
                        style="color: var(--secondary-color)"
                      />
                    </div>

                    <p class="small text-muted mb-0">
                      {{ comment.upvotes.length }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-box {
  height: 300px;
  overflow: hidden;
}
.image-box img {
  width: 100% !important;
}
.btn-primary {
  height: 36px;
  min-width: 120px;
  border-radius: 16px;
}
.box {
  border: 1px solid #e2e3e5;
  border-radius: 10px;
  padding: 20px;
}
card-body {
  display: flex;
  flex-direction: column;
}

.comment-content {
  flex: 1;
}

.comment-date {
  flex-shrink: 0;
}
.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: var(--primary-color);
}
</style>
