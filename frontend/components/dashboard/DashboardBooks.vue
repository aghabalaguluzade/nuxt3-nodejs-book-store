<script setup lang="ts">
import type { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import { useBookStore } from "~/store/bookStore";
import type { Book } from "~/types";

// Use Nuxt App and Book Store
const { $bootstrap } = useNuxtApp();
const bookStore = useBookStore();
const toast = useToast();

// Reactive state for the new book
let newBook = reactive<Book>({
  name: "",
  author: "",
  description: "",
  page: null,
});

let modal: Modal | undefined

// Methods
const addBook = async () => {
  try {
    await bookStore.addBook(newBook);
    modal.hide();
    Object.assign(newBook, {
      name: "",
      author: "",
      description: "",
      page: null,
    });

    await bookStore.fetchBooksByUploader();

    toast.success("New book added successfully", {
      position: "top-right",
      timeout: 1000,
      closeButton: "button",
      icon: true,
      rtl: false,
    });
  } catch (error) {
    console.log(error);
  }
};

// Computed property for user books
const userBooks = computed(() => {
  return bookStore.userUploadedBooks
    .slice()
    .sort((a: Book, b: Book) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
});

// Lifecycle hook
onMounted(() => {
  const modalElement = document.getElementById("modal-main");
  if (modalElement) {
    modal = new $bootstrap.Modal(modalElement);
  }
  bookStore.fetchBooksByUploader();
});
</script>

<template>
  <div>
    <!-- Button -->
    <div class="row mb-3">
      <div class="col text-end">
        <button type="button" class="btn btn-primary" @click="modal.show()">
          Add Book
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="row">
      <div class="col">
        <table class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Description</th>
              <th>Page</th>
              <th class="text-center">Edit</th>
              <th class="text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            <TransitionGroup name="list">
              <tr v-for="book in userBooks" :key="book._id">
                <td>{{ book.name }}</td>
                <td>{{ book.author }}</td>
                <td style="max-width: 250px">
                  {{ book.description }}
                </td>
                <td>{{ book.page }}</td>
                <td class="text-center">
                  <font-awesome
                    :icon="['far', 'pen-to-square']"
                    class="text-warning"
                    style="cursor: pointer"
                  />
                </td>
                <td class="text-center">
                  <font-awesome
                    :icon="['fas', 'trash']"
                    class="text-danger"
                    style="cursor: pointer"
                    @click="deleteBook(book._id)"
                  />
                </td>
              </tr>
            </TransitionGroup>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="modal-main" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addModalLabel">Add Book</h5>
            <button
              type="button"
              @click="modal.hide()"
              class="btn-close"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body mx-5">
            <div class="col mb-3">
              <label for="title" class="form-label"
                >Name
                <span class="text-danger">*</span>
              </label>
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                v-model="newBook.name"
                required
              />
            </div>
            <div class="col mb-3">
              <label for="author" class="form-label"
                >Author
                <span class="text-danger">*</span>
              </label>
              <input
                type="text"
                class="form-control"
                id="author"
                name="author"
                v-model="newBook.author"
                required
              />
            </div>
            <div class="col mb-3">
              <label for="description" class="form-label"
                >Description
                <span class="text-danger">*</span>
              </label>
              <textarea
                name="description"
                id="description"
                class="form-control"
                cols="30"
                rows="10"
                v-model="newBook.description"
              ></textarea>
            </div>
            <div class="col mb-3">
              <label for="author" class="form-label"
                >Number of Pages
                <span class="text-danger">*</span>
              </label>
              <input
                type="number"
                class="form-control"
                id="numOfPages"
                name="numOfPages"
                v-model="newBook.page"
                required
              />
            </div>
            <div class="text-end mb-4">
              <button
                @click="modal.hide()"
                type="button"
                class="btn btn-outline-secondary"
              >
                Close
              </button>
              <button @click="addBook" type="button" class="btn btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-outline-secondary {
  border-radius: 25px;
  height: 48px;
  margin-right: 20px;
  min-width: 120px;
}

.list-enter-active,
.list-leaave-active {
  transition: all 2s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(300px);
}
</style>
