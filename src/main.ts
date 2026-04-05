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

const WarmAura = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{amber.50}',
      100: '{amber.100}',
      200: '{amber.200}',
      300: '{amber.300}',
      400: '{amber.400}',
      500: '{amber.500}',
      600: '{amber.600}',
      700: '{amber.700}',
      800: '{amber.800}',
      900: '{amber.900}',
      950: '{amber.950}',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{stone.50}',
          100: '{stone.100}',
          200: '{stone.200}',
          300: '{stone.300}',
          400: '{stone.400}',
          500: '{stone.500}',
          600: '{stone.600}',
          700: '{stone.700}',
          800: '{stone.800}',
          900: '{stone.900}',
          950: '{stone.950}',
        },
      },
      dark: {
        surface: {
          0: '{stone.950}',
          50: '{stone.900}',
          100: '{stone.800}',
          200: '{stone.700}',
          300: '{stone.600}',
          400: '{stone.500}',
          500: '{stone.400}',
          600: '{stone.300}',
          700: '{stone.200}',
          800: '{stone.100}',
          900: '{stone.50}',
          950: '#ffffff',
        },
        primary: {
          color: '{amber.400}',
          contrastColor: '{stone.950}',
          hoverColor: '{amber.300}',
          activeColor: '{amber.200}',
        },
      },
    },
  },
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

app.use(Primevue, {
  theme: {
    preset: WarmAura,
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
