<script setup lang="ts">
import { useBookStore } from "~/store/bookStore";
import { useAuthStore } from "~/store/authStore";
import { useCommentsStore } from "~/store/commentsStore";
import type { Book } from "~/types";

const route = useRoute();
const router = useRouter();
const storeBooks = useBookStore();
const authStore = useAuthStore();
const commentsStore = useCommentsStore();

const book = ref<Book>({
  name: "",
  author: "",
  description: "",
  page: null,
  updatedAt: null,
});
const loading = ref<boolean>(true);
const commentContent = ref<string>("");

// Methods
const selectedBook = () => {
  const bookId = route.params.id as string;
  book.value = storeBooks.selectedBook(bookId);
  loading.value = false;
};

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

    await commentsStore.fetchCommentsForBook(route.params.id);

  } catch (error) {
    console.log(error);
  }
};

const scrollToComment = () => {
  nextTick(() => {
    const commentId = route.query.comment as string;
    if (commentId) {
      const element = document.getElementById(`comment-${commentId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  selectedBook();
  commentsStore.fetchCommentsForBook(route.params.id);
});

// Watcher
watch(commentsForBook, (newComments: any) => {
  if (newComments.length) {
    scrollToComment();
  }
}, { immediate: true });
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
          <img class="img-fluid" src="../../public/images/b_detail.jpg" />
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
              <div class="col-lg-6">8.2 - (23 rates)</div>
            </div>
            <div class="row border-bottom pb-2">
              <div class="col-lg-6"><strong>Upload Date</strong></div>
              <div class="col-lg-6">{{ book.updatedAt }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-md-6">
        <div class="box">
          <h3 style="color: var(--primary-color)">Rate The Book</h3>
          <form>
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
              />
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary">Rate</button>
          </form>
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
                <p>
                  {{ comment.content }}
                </p>

                <div class="d-flex justify-content-between">
                  <div class="d-flex flex-row align-items-center">
                    <p class="small mb-0 ms-2">
                      {{ comment.postedBy.username }}
                    </p>
                  </div>
                  <div
                    class="d-flex flex-row align-items-center"
                    style="gap: 10px"
                  >
                    <p class="small text-muted mb-0">Upvote?</p>
                    <font-awesome :icon="['far', 'thumbs-up']" />
                    <p class="small text-muted mb-0">3</p>
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
</style>
