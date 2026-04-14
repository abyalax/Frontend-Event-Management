export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  ssr: false,

  extends: ['./layers/shared', './layers/auth', './layers/users'],

  css: ['~/layers/shared/app/assets/css/tailwind.css', 'vue-sonner/style.css'],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },

  modules: [
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxt/test-utils/module',
  ],

  shadcn: {
    prefix: '',
    componentDir: './layers/shared/app/components/ui',
  },

  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'cookie',
    storageKey: 'nuxt-color-mode',
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || '/api',
    },
  },

  vite: {
    define: {
      __DEV__: true,
    },
  },

  app: {
    head: {
      title: 'Nuxt 4 Layers Architecture',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Template Nuxt 4 with shadcn-vue, Tailwind CSS v4 Nuxt Layers Architecture.' },
        { name: 'theme-color', content: '#000000' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
});
