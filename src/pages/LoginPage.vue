<script setup lang="ts">
import { registrationForm } from '@/features/users/form-definitions/registration';
import GenericForm from '@/shared/components/form/GenericForm.vue';
import { useNotification } from '@/shared/composables/use-notification';
import { usePreferredDialog } from '@/shared/composables/use-preferred-dialog';
import { CreateUserDto } from '@/types/entities';
import type { FormDefinition } from '@/shared/components/form/types';
import { authorizationStore } from '@/stores/authorization-store';
import { useUserStore } from '@/features/users/store';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const userData = reactive({
  email: '',
  password: '',
});

const isProcessing = ref(false);
const isSubmitting = ref(false);

const canLogin = computed(() => userData.email.trim() !== '' && userData.password.trim() !== '');

const { showSaveSuccess, showSaveError } = useNotification();
const { handleLogin } = authorizationStore();
const store = useUserStore();

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
      modal: true,
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
    await store.saveEntity(payload);
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
    <div class="w-full max-w-md mx-4">
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
            <InputText id="email" v-model="userData.email" type="text" class="w-full" />
          </div>

          <div class="mb-6">
            <label for="password" class="block text-surface-700 font-medium mb-2 text-sm">
              {{ t('login.password') }}
            </label>
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
