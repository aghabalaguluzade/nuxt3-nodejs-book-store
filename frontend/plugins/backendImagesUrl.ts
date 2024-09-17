export default defineNuxtPlugin(nuxtApp => {
  const backendImagesUrl = useRuntimeConfig().public.backendImagesUrl;
  nuxtApp.provide('backendImagesUrl', backendImagesUrl);
});