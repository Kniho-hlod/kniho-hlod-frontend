<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useNotification } from '@/shared/composables/use-notification';

const { t } = useI18n();
const { showSaveSuccess } = useNotification();

const timezone = ref(localStorage.getItem('timezone') ?? 'Europe/Prague');

const notifications = ref({
  news: true,
  loanExpiry: true,
  security: true,
});

const timezoneOptions = [
  { label: 'Praha (UTC+1)', value: 'Europe/Prague' },
  { label: 'Londýn (UTC+0)', value: 'Europe/London' },
  { label: 'New York (UTC-5)', value: 'America/New_York' },
];

function savePreferences() {
  localStorage.setItem('timezone', timezone.value);
  showSaveSuccess(t('common.save'), t('account.savePreferences'));
}
</script>

<template>
  <div class="grid gap-5">
    <!-- Timezone -->
    <div>
      <label class="block text-surface-700 font-medium mb-1.5 text-sm">
        {{ t('account.timezone') }}
      </label>
      <Select
        v-model="timezone"
        :options="timezoneOptions"
        option-label="label"
        option-value="value"
        fluid
      />
    </div>

    <!-- Notifications -->
    <div>
      <p class="text-surface-700 font-medium text-sm mb-3">{{ t('account.notifications') }}</p>
      <div class="grid gap-3">
        <label
          class="flex items-center justify-between p-3 bg-surface-50 rounded-xl cursor-pointer hover:bg-surface-100 transition-colors"
        >
          <div>
            <p class="text-surface-700 text-sm font-medium">{{ t('account.notifNews') }}</p>
            <p class="text-surface-400 text-xs">{{ t('account.notifNewsDesc') }}</p>
          </div>
          <ToggleSwitch v-model="notifications.news" />
        </label>

        <label
          class="flex items-center justify-between p-3 bg-surface-50 rounded-xl cursor-pointer hover:bg-surface-100 transition-colors"
        >
          <div>
            <p class="text-surface-700 text-sm font-medium">{{ t('account.notifLoanExpiry') }}</p>
            <p class="text-surface-400 text-xs">{{ t('account.notifLoanExpiryDesc') }}</p>
          </div>
          <ToggleSwitch v-model="notifications.loanExpiry" />
        </label>

        <label
          class="flex items-center justify-between p-3 bg-surface-50 rounded-xl cursor-pointer hover:bg-surface-100 transition-colors"
        >
          <div>
            <p class="text-surface-700 text-sm font-medium">{{ t('account.notifSecurity') }}</p>
            <p class="text-surface-400 text-xs">{{ t('account.notifSecurityDesc') }}</p>
          </div>
          <ToggleSwitch v-model="notifications.security" />
        </label>
      </div>
    </div>

    <div class="flex justify-end">
      <Button :label="t('account.savePreferences')" icon="pi pi-check" @click="savePreferences" />
    </div>
  </div>
</template>
