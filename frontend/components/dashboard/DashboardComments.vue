<script setup lang="ts">
import type { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import { useCommentsStore } from "~/store/commentsStore";
import { useAuthStore } from "~/store/authStore";

// Use Nuxt App and Book Store
const { $bootstrap } = useNuxtApp();
const toast = useToast();
const commentsStore = useCommentsStore();
const authStore = useAuthStore();

const modalTitle = ref<string>("Edit Comment");
const commentContent = ref<string>("");
const commentId = ref<string>("");

let modal: Modal | undefined;

// Methods
const openModal = (comment) => {
  commentId.value = comment._id;
  commentContent.value = comment.content;
  modal?.show();
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

const updateComment = async () => {
  try {
    await commentsStore.updateComment(commentId.value, commentContent.value);
    await commentsStore.fetchCommentsByUser(authStore.user?._id);

    modal?.hide();
    showToast("The book edited successfully", {
      type: "success",
      timeout: 3000,
    });

  } catch (error) {
    console.error(error);
  }
};

// Computed
const commentsByUser = computed(() => commentsStore.commentsByUser);

// Lifecycle hook
onMounted(() => {
  const modalElement = document.getElementById("modal-main");
  if (modalElement) {
    modal = new $bootstrap.Modal(modalElement);
  }
  commentsStore.fetchCommentsByUser(authStore.user?._id);
});
</script>

<template>
  <div class="row">
    <div class="col">
      <table class="table">
        <thead>
          <tr>
            <th>Content</th>
            <th>Book</th>
            <th class="text-center">Edit</th>
            <th class="text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in commentsByUser" :key="comment._id">
            <td>
              <NuxtLink
                :to="{
                  path: `/books/${comment.book._id}`,
                  query: { comment: comment._id },
                }"
                class="text-decoration-none"
              >
                {{ comment.content }}
              </NuxtLink>
            </td>
            <td>
              <NuxtLink :to="`books/${comment.book._id}`">{{
                comment.book.name
              }}</NuxtLink>
            </td>
            <td class="text-center">
              <font-awesome
                :icon="['far', 'pen-to-square']"
                class="text-warning"
                style="cursor: pointer"
                @click="openModal(comment)"
              />
            </td>
            <td class="text-center">
              <font-awesome
                :icon="['fas', 'trash']"
                class="text-danger"
                style="cursor: pointer"
              />
            </td>
          </tr>
        </tbody>
      </table>
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
              <label for="description" class="form-label"
                >Comment
                <span class="text-danger">*</span>
              </label>
              <textarea
                name="description"
                id="description"
                class="form-control"
                cols="30"
                rows="4"
                v-model="commentContent"
              ></textarea>
            </div>
            <div class="text-end mb-4">
              <button
                @click="modal.hide()"
                type="button"
                class="btn btn-outline-secondary"
              >
                Close
              </button>
              <button @click="updateComment()" type="button" class="btn btn-primary">
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
.list-leave-active {
  position: absolute;
}
</style>