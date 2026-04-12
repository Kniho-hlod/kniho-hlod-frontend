<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const newPassword = ref('');
const confirmPassword = ref('');
</script>

<template>
  <div class="flex items-center justify-center min-h-dvh bg-hlod bg-cover bg-center bg-no-repeat">
    <div class="w-full max-w-md mx-4">
      <div class="bg-surface-0 rounded-2xl shadow-2xl shadow-stone-900 overflow-hidden">
        <!-- Header -->
        <div class="bg-primary px-8 py-8 text-center">
          <h1 class="text-white text-3xl font-bold tracking-wide mb-1">
            {{ t('login.resetPasswordTitle') }}
          </h1>
          <p class="text-white text-sm">{{ t('login.resetPasswordDesc') }}</p>
        </div>

        <!-- Form -->
        <div class="px-8 py-8">
          <div class="mb-5">
            <label for="new-password" class="block text-surface-700 font-medium mb-2 text-sm">
              {{ t('login.resetPasswordNew') }}
            </label>
            <Password id="new-password" v-model="newPassword" :feedback="false" toggle-mask fluid />
          </div>

          <div class="mb-6">
            <label for="confirm-password" class="block text-surface-700 font-medium mb-2 text-sm">
              {{ t('login.resetPasswordConfirm') }}
            </label>
            <Password
              id="confirm-password"
              v-model="confirmPassword"
              :feedback="false"
              toggle-mask
              fluid
            />
          </div>

          <Button
            :label="t('login.resetPasswordSubmit')"
            icon="pi pi-check"
            fluid
            :disabled="newPassword.trim() === '' || confirmPassword.trim() === ''"
          />
        </div>
      </div>
    </div>
  </div>
</template>
