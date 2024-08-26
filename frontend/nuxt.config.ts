// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@vesp/nuxt-fontawesome'],
  css: ['assets/css/bootstrap.css', 'assets/css/style.css', 'assets/css/responsive.css', 'assets/css/font-awesome.min.css', 'assets/css/ion.rangeSlider.min.css'],
  app: {
    head: {
      meta: [
        {
          charset: 'utf-8'
        },
        {
          "http-equiv": 'X-UA-Compatible',
          content: 'IE=edge'
        },
        {
          name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
        },
        {
          name: 'keywords', content: ''
        },
        {
          name: 'description', content: ''
        },
        {
          name: 'author', content: ''
        }
      ],
      title: 'Bostorek Book Store',
      link: [
        {
          rel: 'icon', href: '/images/favicon.png', type: 'image/gif'
        },
      ],
      script : [
        { src: 'js/jquery-3.4.1.min.js', tagPosition: 'bodyOpen' },
        { src: 'js/bootstrap.js', tagPosition: 'bodyOpen' },
        { src: 'js/custom.js', tagPosition: 'bodyClose' },
        { src: 'js/ion.rangeSlider.min.js', tagPosition: 'bodyOpen' },
      ]
    },
  },
  fontawesome: {
    icons: {
      solid: ['arrow-left', 'thumbs-up'],
      regular: ['thumbs-up'],
      brands: [],
    },
  }
})