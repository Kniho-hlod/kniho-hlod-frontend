<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AccountInformation from '@/features/account/components/AccountInformation.vue';
import AccountPreferences from '@/features/account/components/AccountPreferences.vue';
import AccountSecurity from '@/features/account/components/AccountSecurity.vue';
import UserCard from '@/features/overview/components/UserCard.vue';

const { t } = useI18n();
</script>

<template>
  <div class="grid gap-4">
    <div>
      <h1 class="text-2xl font-bold text-surface-800 dark:text-stone-100">{{ t('account.title') }}</h1>
      <p class="text-surface-500 dark:text-stone-400 text-sm">{{ t('account.subtitle') }}</p>
    </div>

    <UserCard />

    <Accordion :value="['0']" multiple>
      <AccordionPanel value="0">
        <AccordionHeader>
          <div class="flex items-center gap-2">
            <i class="pi pi-user text-primary-500"></i>
            <span class="font-medium">{{ t('account.tabInfo') }}</span>
          </div>
        </AccordionHeader>
        <AccordionContent>
          <account-information />
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel value="1">
        <AccordionHeader>
          <div class="flex items-center gap-2">
            <i class="pi pi-shield text-primary-500"></i>
            <span class="font-medium">{{ t('account.tabSecurity') }}</span>
          </div>
        </AccordionHeader>
        <AccordionContent>
          <account-security />
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel value="2">
        <AccordionHeader>
          <div class="flex items-center gap-2">
            <i class="pi pi-cog text-primary-500"></i>
            <span class="font-medium">{{ t('account.tabPreferences') }} - Unavailable</span>
          </div>
        </AccordionHeader>
        <AccordionContent>
          <account-preferences />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>
