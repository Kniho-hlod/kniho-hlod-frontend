<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDate } from '@/shared/utils/date';
import { authorizationStore } from '@/stores/authorization-store';
import { useNotification } from '@/shared/composables/use-notification';

const { t } = useI18n();
const { loggedUser } = authorizationStore();
const { showInfo } = useNotification();

const showPasswordForm = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');
const passwordError = ref('');

function openPasswordForm() {
  showPasswordForm.value = true;
  newPassword.value = '';
  confirmPassword.value = '';
  passwordError.value = '';
}

function cancelPasswordChange() {
  showPasswordForm.value = false;
  passwordError.value = '';
}

function submitPasswordChange() {
  passwordError.value = '';
  if (newPassword.value.length < 6) {
    passwordError.value = t('account.newPasswordPlaceholder');
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = t('account.confirmPasswordPlaceholder');
    return;
  }
  showInfo(t('common.save'), t('account.changePassword'));
  showPasswordForm.value = false;
}
</script>

<template>
  <div class="grid gap-5">
    <!-- Password section -->
    <div class="p-4 bg-surface-50 rounded-xl">
      <div class="flex items-center justify-between mb-2">
        <div>
          <p class="font-medium text-surface-700 text-sm">{{ t('account.password') }}</p>
          <p class="text-surface-400 text-xs">
            {{
              t('account.passwordLastChanged', { date: formatDate(loggedUser?.updatedAt) || '—' })
            }}
          </p>
        </div>
        <Button
          :label="t('account.changePassword')"
          icon="pi pi-key"
          size="small"
          outlined
          severity="secondary"
          @click="openPasswordForm"
        />
      </div>

      <!-- Password form -->
      <Transition name="slide-down">
        <div v-if="showPasswordForm" class="mt-4 grid gap-3 border-t border-surface-200 pt-4">
          <div>
            <label class="block text-surface-700 font-medium mb-1.5 text-sm">
              {{ t('account.newPassword') }}
            </label>
            <InputText
              v-model="newPassword"
              type="password"
              :placeholder="t('account.newPasswordPlaceholder')"
              fluid
            />
          </div>
          <div>
            <label class="block text-surface-700 font-medium mb-1.5 text-sm">
              {{ t('account.confirmPassword') }}
            </label>
            <InputText
              v-model="confirmPassword"
              type="password"
              :placeholder="t('account.confirmPasswordPlaceholder')"
              fluid
            />
          </div>
          <p v-if="passwordError" class="text-red-500 text-xs">{{ passwordError }}</p>
          <div class="flex gap-2 justify-end">
            <Button
              :label="t('common.cancel')"
              size="small"
              outlined
              severity="secondary"
              @click="cancelPasswordChange"
            />
            <Button
              :label="t('account.savePassword')"
              icon="pi pi-check"
              size="small"
              @click="submitPasswordChange"
            />
          </div>
        </div>
      </Transition>
    </div>

    <!-- 2FA placeholder -->
    <div class="p-4 bg-surface-50 rounded-xl flex items-center justify-between">
      <div>
        <p class="font-medium text-surface-700 text-sm">{{ t('account.twoFactor') }}</p>
        <p class="text-surface-400 text-xs">{{ t('account.twoFactorDesc') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <Tag :value="t('account.inactive')" severity="secondary" />
        <Button
          :label="t('account.activate')"
          icon="pi pi-lock"
          size="small"
          outlined
          severity="secondary"
          disabled
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
