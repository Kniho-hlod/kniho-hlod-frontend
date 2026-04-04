import { configureServices } from '@kniho-hlod/kniho-hlod-service';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import { createPinia } from 'pinia';
import 'primeicons/primeicons.css';
import Primevue from 'primevue/config';
import DialogService from 'primevue/dialogservice';
import ToastService from 'primevue/toastservice';
import { createApp } from 'vue';
import { useDarkMode } from '@/shared/composables/use-dark-mode';

import App from '@/App.vue';
import '@/assets/main.css';
import router from '@/router';
import { i18n } from '@/i18n';
import { authorizationStore } from './stores/authorization-store';
import ConfirmationService from 'primevue/confirmationservice';

const TealAura = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{teal.50}',
      100: '{teal.100}',
      200: '{teal.200}',
      300: '{teal.300}',
      400: '{teal.400}',
      500: '{teal.500}',
      600: '{teal.600}',
      700: '{teal.700}',
      800: '{teal.800}',
      900: '{teal.900}',
      950: '{teal.950}',
    },
  },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

app.use(Primevue, {
  theme: {
    preset: TealAura,
    options: {
      darkModeSelector: '.p-dark',
    },
  },
});

app.use(i18n);
app.use(router);
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);

useDarkMode();

configureServices(
  import.meta.env.VITE_BACKEND_URL,
  () => localStorage.getItem('auth-token')
);

const store = authorizationStore();
store.initializeAuth();

app.mount('#app');
