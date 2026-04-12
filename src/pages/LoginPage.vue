<script setup lang="ts">
import { registrationForm } from '@/features/users/form-definitions/registration';
import GenericForm from '@/shared/components/form/GenericForm.vue';
import { useNotification } from '@/shared/composables/use-notification';
import { usePreferredDialog } from '@/shared/composables/use-preferred-dialog';
import { useFormDialog } from '@/shared/composables/use-form-dialog';
import { CreateUserDto } from '@/types/entities';
import type { FormDefinition } from '@/shared/components/form/types';
import { authorizationStore } from '@/stores/authorization-store';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getServices } from '@kniho-hlod/kniho-hlod-service';
import type { SystemNotification } from '@/types/entities';
import { setLocale } from '@/i18n';
import { useDarkMode } from '@/shared/composables/use-dark-mode';

const { t, locale } = useI18n();
const { isDark, toggle } = useDarkMode();
const { openFormDialog } = useFormDialog();

const forgotPasswordForm: FormDefinition<{ email: string, info: string }> = {
  fields: [
    {
      name: 'info',
      label: '',
      type: 'description',
      text: t('login.forgotPasswordInfo'),
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validators: [
        (value) =>
          typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? 'Zadejte platný email'
            : null,
      ],
    },
  ],
  submitLabel: t('login.forgotPasswordSubmit'),
  showCancel: true,
};

function openForgotPassword(): void {
  openFormDialog({
    definition: forgotPasswordForm as FormDefinition<Record<string, unknown>>,
    modelValue: { email: '' },
    header: t('login.forgotPasswordTitle'),
    dialogSize: 'compact',
    onSave: async () => {
      // TODO: volat API pro reset hesla
    },
  });
}

const userData = reactive({
  email: '',
  password: '',
});

const isProcessing = ref(false);
const isSubmitting = ref(false);

const canLogin = computed(() => userData.email.trim() !== '' && userData.password.trim() !== '');

const { showSaveSuccess, showSaveError } = useNotification();
const { handleLogin } = authorizationStore();

async function handleAuthorization(): Promise<void> {
  isProcessing.value = true;
  try {
    await handleLogin(userData);
    showSaveSuccess(t('login.loginSuccess'), t('login.loginSuccessDetail'));
  } catch (error) {
    showSaveError(t('login.loginError'), t('login.loginErrorDetail'));
    console.error(error);
  } finally {
    isProcessing.value = false;
  }
}

const activeNotifications = ref<SystemNotification[]>([]);

onMounted(async () => {
  try {
    activeNotifications.value = await getServices().systemNotifications.getActive() as SystemNotification[];
  } catch {
    // login page must not fail due to notifications
  }
});

const dialog = usePreferredDialog();
let registrationDialogRef: ReturnType<typeof dialog.open> | null = null;

function openRegistrationDialog(data: CreateUserDto): void {
  registrationDialogRef = dialog.open(
    GenericForm,
    {
      definition: registrationForm as unknown as FormDefinition<Record<string, unknown>>,
      modelValue: data as unknown as Record<string, unknown>,
      mode: 'create',
      submitting: isSubmitting.value,
      onSubmit: handleRegistration as unknown as (value: Record<string, unknown>) => void,
    },
    {
      header: t('login.registrationTitle'),
      dialogSize: 'form',
    }
  );
}

async function handleRegistration(values: Record<string, unknown>): Promise<void> {
  isSubmitting.value = true;
  registrationDialogRef?.updateProps({ submitting: true });
  const payload = { ...(values as CreateUserDto), role: 'user' as const };

  try {
    await getServices().auth.register(payload);
    showSaveSuccess(
      t('login.registrationSuccess'),
      t('login.registrationSuccessDetail', { username: payload.username })
    );
    registrationDialogRef?.close();
  } catch {
    showSaveError(
      t('login.registrationError'),
      t('login.registrationErrorDetail', { username: payload.username })
    );
  } finally {
    isSubmitting.value = false;
    registrationDialogRef?.updateProps({ submitting: false });
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-dvh bg-hlod bg-cover bg-center bg-no-repeat">
    <!-- Language switcher — top left -->
    <div class="fixed top-3 left-3 flex items-center gap-1 z-10 bg-white dark:bg-stone-800/80 rounded-lg p-1">
      <Button label="CS" :text="locale !== 'cs'" size="small" @click="setLocale('cs')" />
      <Button label="EN" :text="locale !== 'en'" size="small" @click="setLocale('en')" />
    </div>

    <!-- Dark mode toggle — top right -->
    <div class="fixed top-3 right-3 z-10 bg-white dark:bg-stone-800/80 rounded-lg p-1">
      <Button
        :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
        text
        size="small"
        @click="toggle"
      />
    </div>
    <div class="w-full max-w-md mx-4">
      <!-- Active system notifications -->
      <div v-if="activeNotifications.length > 0" class="mb-4 grid gap-2">
        <Message
          v-for="n in activeNotifications"
          :key="n.id"
          :severity="n.severity === 'warn' ? 'warn' : 'info'"
          :icon="n.severity === 'warn' ? 'pi pi-exclamation-triangle' : 'pi pi-info-circle'"
        >
          <span class="font-bold mb-2">{{ n.title }}</span>
          <p v-if="n.message" class="">{{ n.message }}</p>
        </Message>
      </div>

      <div class="bg-surface-0 rounded-2xl shadow-2xl shadow-stone-900 overflow-hidden">
        <!-- Header -->
        <div class="bg-primary px-8 py-8 text-center">
          <div class="flex justify-center mb-3">
            <!-- <div class="w-24 h-24 bg-amber-100/90 rounded-full flex items-center justify-center shadow-lg">
              <img src="@/assets/logo.svg" alt="Kniho-hlod" class="w-16 h-16" />
            </div> -->
          </div>
          <h1 class="text-white text-3xl font-bold tracking-wide mb-1">
            {{ t('login.title') }}
          </h1>
          <p class="text-white text-sm">{{ t('login.subtitle') }}</p>
        </div>

        <!-- Form -->
        <div class="px-8 py-8">
          <div class="mb-5">
            <label for="email" class="block text-surface-700 font-medium mb-2 text-sm">
              {{ t('login.email') }}
            </label>
            <InputText id="email" v-model="userData.email" type="text" fluid />
          </div>

          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-surface-700 font-medium text-sm">
                {{ t('login.password') }}
              </label>
              <a
                class="text-xs text-primary-500 font-medium cursor-pointer hover:text-primary-600 hover:underline"
                @click="openForgotPassword"
              >
                {{ t('login.forgotPassword') }}
              </a>
            </div>
            <Password
              id="password"
              v-model="userData.password"
              :feedback="false"
              toggle-mask
              fluid
              @keyup.enter="handleAuthorization"
            />
          </div>

          <Button
            :label="t('login.submit')"
            icon="pi pi-sign-in"
            fluid
            :disabled="isProcessing || !canLogin"
            :loading="isProcessing"
            @click="handleAuthorization"
          />

          <div class="text-center mt-5 text-sm">
            <span class="text-surface-500">{{ t('login.noAccount') }}</span>
            <a
              class="ml-2 text-primary-500 font-semibold cursor-pointer hover:text-primary-600 hover:underline"
              @click="() => openRegistrationDialog(new CreateUserDto())"
            >
              {{ t('login.register') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
