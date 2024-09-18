<script setup lang="ts">
import type { Modal } from "bootstrap";
import { Dropzone } from "dropzone";
import "dropzone/dist/dropzone.css";
// import VueDropzone from 'vue3-dropzone';
import { useToast } from "vue-toastification";
import { useBookStore } from "~/store/bookStore";
import { useAuthStore } from "~/store/authStore";
import PaginationWidget from "../widgets/PaginationWidget.vue";
import type { Book } from "~/types";

// Use Nuxt App and Book Store
const { $bootstrap } = useNuxtApp();
const { $backendImagesUrl } = useNuxtApp();
const toast = useToast();
const bookStore = useBookStore();
const authStore = useAuthStore();

// Reactive state for the new book
let newBook = reactive<Book>({
  name: "",
  author: "",
  description: "",
  page: null,
  image: "",
  premium: null,
  editedBookId: null,
});
const modalTitle = ref<string>("Add Book");
const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(10);
const dropzoneElement = ref<HTMLDivElement | null>(null);

let modal: Modal | undefined;
let dropzone: Dropzone | null = null;

// Methods
const saveBook = () => {
  modalTitle.value === "Add Book" ? addBook() : editBook();
};

const updatePage = async (page: number) => {
  currentPage.value = page;
};

const openAddModal = () => {
  modalTitle.value = "Add Book";
  Object.assign(newBook, {
    name: "",
    author: "",
    description: "",
    page: null,
    premium: null,
    editedBook: null,
  });
  modal?.show();
};

const openEditModal = (existingBook: Book) => {
  modalTitle.value = "Edit Book";
  Object.assign(newBook, {
    ...existingBook,
    editedBookId: existingBook._id,
  });
  modal?.show();
};

const addBook = async () => {
  try {
    await new Promise<void>((resolve, reject) => {
      dropzone?.on("complete", (file) => {
        if (file.status === "success") {
          resolve();
        } else {
          reject(new Error("File upload failed"));
        }
      });

      dropzone?.processQueue();
    });

    await bookStore.addBook(newBook);

    currentPage.value = 1;
    await bookStore.fetchBooksByUploader();

    modal?.hide();
    Object.assign(newBook, {
      name: "",
      author: "",
      description: "",
      page: null,
      image: null,
      premium: null,
      editedBookId: null,
    });

    showToast("New book added successfully", {
      type: "success",
      position: "top-right",
      timeout: 1000,
    });
  } catch (error) {
    console.log(error);
    showToast("Failed to add book", {
      type: "error",
      position: "top-right",
      timeout: 3000,
    });
  }
};

const editBook = async () => {
  try {
    await bookStore.editTheBook(newBook.editedBookId, newBook);
    await bookStore.fetchBooksByUploader();

    modal?.hide();
    showToast("The book edited successfully", {
      type: "success",
      timeout: 3000,
    });
  } catch (error) {
    console.error(error);
  }
};

const showToast = (message: string, options: object) => {
  toast(message, {
    position: "top-right",
    closeButton: "button",
    icon: true,
    rtl: false,
    ...options,
  });
};

const deleteBook = async (id: string, name: string) => {
  try {
    await bookStore.deleteTheBook(id);
    await bookStore.fetchBooksByUploader();

    showToast(`${name} deleted successfully`, {
      type: "warning",
      timeout: 3000,
    });
  } catch (error) {
    console.error(error);
  }
};

console.log(bookStore.userUploadedBooks);

// Computed property for user books
const userBooks = computed(() => {
  return bookStore.userUploadedBooks
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.createdAt ?? 0).getTime();
      const dateB = new Date(b.createdAt ?? 0).getTime();
      return dateB - dateA;
    });
});

const totalPages = computed(() => {
  return Math.ceil(userBooks.value.length / itemsPerPage.value);
});

const paginatedBooks = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return userBooks.value.slice(startIndex, endIndex);
});

// Lifecycle hook
onMounted(() => {
  const modalElement = document.getElementById("modal-main");
  if (modalElement) {
    modal = new $bootstrap.Modal(modalElement);
  }

  bookStore.fetchBooksByUploader();

  if (dropzoneElement.value) {
    dropzone = new Dropzone(dropzoneElement.value, {
      url: "http://localhost:5000/api/v1/books/upload",
      thumbnailWidth: 150,
      maxFilesize: 2, // Max file size in MB
      dictDefaultMessage: "Drag files here or click to upload",
      paramName: "image", // Param name should match with multer's expected field name
      acceptedFiles: "image/*",
      autoProcessQueue: false, // Disable automatic file uploads
      init: function () {
        this.on("sending", (file, xhr, formData) => {
          xhr.setRequestHeader("Authorization", `Bearer ${authStore.token}`);

          // formData.append("name", newBook.name);
          // formData.append("author", newBook.author);
          // formData.append("description", newBook.description);
          // formData.append("page", newBook.page);
        });

        this.on("success", (file, response) => {
          // Handle success
          console.log("File uploaded successfully", response);
          newBook.image = response.filePath.replace('public/', '');
        });

        this.on("error", (file, message) => {
          // Handle error
          console.error("Upload failed:", message);
        });
      },
    });
  }
});

onUnmounted(() => {
  if (dropzone) {
    dropzone.destroy(); // Clean up Dropzone instance when component unmounts
  }
});
</script>

<template>
  <div>
    <!-- Button -->
    <div class="row mb-3">
      <div class="col text-end">
        <button type="button" class="btn btn-primary" @click="openAddModal()">
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
              <th>Img</th>
              <th>Title</th>
              <th>Author</th>
              <th>Page</th>
              <th class="text-center">Edit</th>
              <th class="text-center">Delete</th>
            </tr>
          </thead>
          <TransitionGroup name="list" tag="tbody">
            <tr v-for="book in paginatedBooks" :key="book._id">
              <td class="center-align">
                <NuxtLink :to="`/books/${book._id}`">
                  <img
                    :src="`${$backendImagesUrl}/${book.image}`"
                    :alt="book.name"
                    style="width: 50px"
                  />
                </NuxtLink>
              </td>
              <td class="center-align">
                <NuxtLink :to="`/books/${book._id}`">
                  {{ book.name }}
                </NuxtLink>
              </td>
              <td class="center-align">{{ book.author }}</td>
              <td class="center-align">{{ book.page }}</td>
              <td class="text-center center-align">
                <font-awesome
                  :icon="['far', 'pen-to-square']"
                  class="text-warning"
                  style="cursor: pointer"
                  @click="openEditModal(book)"
                />
              </td>
              <td class="text-center center-align">
                <font-awesome
                  :icon="['fas', 'trash']"
                  class="text-danger"
                  style="cursor: pointer"
                  @click="deleteBook(book._id, book.name)"
                />
              </td>
            </tr>
          </TransitionGroup>
        </table>
      </div>
    </div>

    <div class="row">
      <PaginationWidget
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-changed="updatePage"
      />
    </div>

    <!-- Modal -->
    <div class="modal fade" id="modal-main" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addModalLabel">{{ modalTitle }}</h5>
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
                rows="4"
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

            <div class="col mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" name="premium" v-model="newBook.premium" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                  Premium
                </label>
              </div>
            </div>

            <div ref="dropzoneElement" class="my-dropzone"></div>

            <div class="text-end mb-4">
              <button
                @click="modal.hide()"
                type="button"
                class="btn btn-outline-secondary"
              >
                Close
              </button>
              <button @click="saveBook()" type="button" class="btn btn-primary">
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
.center-align {
  vertical-align: middle;
}

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
.list-leave-active {
  position: absolute;
}

.my-dropzone {
  border: 2px dashed #007bff;
  border-radius: 5px;
  padding: 20px;
  width: 100%;
  height: 200px;
  background: #f8f9fa;
  cursor: pointer;
}
</style>
