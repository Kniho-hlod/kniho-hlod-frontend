<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { formatDate } from '@/shared/utils/date';
import { authorizationStore } from '@/stores/authorization-store';
import { getServices } from '@kniho-hlod/kniho-hlod-service';
import { useFormDialog } from '@/shared/composables/use-form-dialog';
import {
  passwordChangeFormDefinition,
  type PasswordChangeForm,
} from '@/features/account/password-change-form-definition';

const { t } = useI18n();
const { loggedUser } = authorizationStore();
const { openFormDialog } = useFormDialog();

function openPasswordChangeDialog(): void {
  openFormDialog<PasswordChangeForm>({
    definition: passwordChangeFormDefinition,
    modelValue: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'create',
    header: t('account.changePassword'),
    onSave: async (values) => {
      await getServices().auth.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
    },
  });
}
</script>

<template>
  <div class="grid gap-5">
    <div class="p-4 bg-surface-50 rounded-xl">
      <div class="flex items-center justify-between">
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
          @click="openPasswordChangeDialog"
        />
      </div>
    </div>

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
