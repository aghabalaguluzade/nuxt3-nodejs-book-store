import { format } from 'date-fns';

export default defineNuxtPlugin(nuxtApp => {
   nuxtApp.provide('formatDate', (isoDateString) => {
      const date = new Date(isoDateString);
      return format(date, 'dd MMMM yyyy HH:mm:ss');
   });
});
