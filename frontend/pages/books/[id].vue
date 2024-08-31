<script setup lang="ts">
import type { Book } from '~/types';

const route = useRoute();
const router = useRouter();

const book = ref<Book | null>(null);
const bookId = route.params.id as string;
const loading = ref<boolean>(true);

const { data, error } = useFetch<Book>(`/api/books/${bookId}`);

watchEffect(() => {
  if (data.value) {
    book.value = data.value;
    loading.value = false;
  }
  if (error.value) {
    console.error('Client-side error:', error.value.message);
  }
});

const goToBackBooks = () => {
  router.push('/books');  
}

</script>

<template>
  <section class="container" v-if="! loading">
    <Head>
      <Title>{{ book?.name }}</Title>
      <Meta name="description" :content="book?.description" />
    </Head>
    <div class="container">
      <section-header :title="book?.name" :text="book?.author" />
      <font-awesome icon="arrow-left" size="2xl" class="mb-2" style="cursor:pointer" @click="goToBackBooks" />
      <div class="row mb-4">
        <div class="col-lg-6">
          <img class="card-img-top" src="../../public/images/b_detail.jpg" alt="card-img-top" />
        </div>
        <div class="col-lg-6 details-wrapper">
          <p class="lead description">{{ book?.description }}</p>
          <div class="mb-4">
            <div class="row border-bottom pb-2">
              <div class="col-lg-6"><strong>Page</strong></div>
              <div class="col-lg-6">{{ book?.page }}</div>
            </div>
            <div class="row border-bottom pb-2">
              <div class="col-lg-6"><strong>Category</strong></div>
              <div class="col-lg-6">Fiction</div>
            </div>
            <div class="row border-bottom pb-2">
              <div class="col-lg-6"><strong>Rating</strong></div>
              <div class="col-lg-6">{{ book?.rating }}</div>
            </div>
            <div class="row border-bottom pb-2">
              <div class="col-lg-6"><strong>Upload Date</strong></div>
              <div class="col-lg-6">{{ book?.createdAt }}</div>
            </div>
          </div>

          <div class="comments-section">
            <h3 class="diplay-6 mb-2">Comments</h3>
            <div class="card mb-4">
              <div class="card-body">
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat, suscipit.</p>
                <div class="d-flex justify-content-between">
                  <p class="fw-bold fst-italic">John Doe</p>
                  <div class="d-flex align-items-center">
                    <font-awesome :icon="['far', 'thumbs-up']" />
                    <p class="ps-2 mb-0"><strong>8</strong></p>
                  </div>
                </div>
              </div>
            </div>
            <div class="card mb-4">
              <div class="card-body">
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat, suscipit.</p>
                <div class="d-flex justify-content-between">
                  <p class="fw-bold fst-italic">John Doe</p>
                  <div class="d-flex align-items-center">
                    <font-awesome :icon="['far', 'thumbs-up']" />
                    <p class="ps-2 mb-0"><strong>8</strong></p>
                  </div>
                </div>
              </div>
            </div>
            <div class="card mb-4">
              <div class="card-body">
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat, suscipit.</p>
                <div class="d-flex justify-content-between">
                  <p class="fw-bold fst-italic">John Doe</p>
                  <div class="d-flex align-items-center">
                    <font-awesome :icon="['far', 'thumbs-up']" />
                    <p class="ps-2 mb-0"><strong>8</strong></p>
                  </div>
                </div>
              </div>
            </div>
            <div class="card mb-4">
              <div class="card-body">
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat, suscipit.</p>
                <div class="d-flex justify-content-between">
                  <p class="fw-bold fst-italic">John Doe</p>
                  <div class="d-flex align-items-center">
                    <font-awesome :icon="['far', 'thumbs-up']" />
                    <p class="ps-2 mb-0"><strong>8</strong></p>
                  </div>
                </div>
              </div>
            </div>
            <div class="card mb-4">
              <div class="card-body">
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat, suscipit.</p>
                <div class="d-flex justify-content-between">
                  <p class="fw-bold fst-italic">John Doe</p>
                  <div class="d-flex align-items-center">
                    <font-awesome :icon="['far', 'thumbs-up']" />
                    <p class="ps-2 mb-0"><strong>8</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="container" v-else>
    <p>Book details loading...</p>
  </div>
</template>

<style scoped>
.details-wrapper {
  max-height: 740px;
  display: flex;
  flex-direction: column;
}
.comments-section {
  flex-grow: 1;
  overflow-y: auto;
}
.description {
  min-height: 150px;
  max-height: 250px;
  overflow-y: auto;
}
</style>