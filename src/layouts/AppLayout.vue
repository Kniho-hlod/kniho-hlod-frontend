<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { authorizationStore } from '@/stores/authorization-store';
import { getActiveLoans, getOverdueLoans } from '@/features/loans/store';
import { setLocale } from '@/i18n';
import { useDarkMode } from '@/shared/composables/use-dark-mode';
import { useAvatarUrl } from '@/shared/composables/use-avatar-url';

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();
const { loggedUser, logOut } = authorizationStore();
const { isDark, toggle } = useDarkMode();

interface NavItem {
  label: () => string;
  icon: string;
  route: string;
  role?: string;
  badge?: () => number;
}

const allNavItems: NavItem[] = [
  { label: () => t('nav.overview'), icon: 'pi pi-home', route: '/home/overview' },
  {
    label: () => t('nav.loans'),
    icon: 'pi pi-address-book',
    route: '/home/loans',
    badge: () => getActiveLoans().length,
  },
  { label: () => t('nav.books'), icon: 'pi pi-book', route: '/home/books' },
  { label: () => t('nav.notifications'), icon: 'pi pi-bell', route: '/home/notifications', badge: () => getOverdueLoans().length },
  { label: () => t('nav.account'), icon: 'pi pi-user', route: '/home/account' },
  { label: () => t('nav.admin'), icon: 'pi pi-cog', route: '/home/admin', role: 'admin' },
];

const navItems = computed(() =>
  allNavItems.filter((item) => !item.role || item.role === loggedUser?.role)
);

function isActive(itemRoute: string): boolean {
  return route.path === itemRoute || route.path.startsWith(itemRoute + '/');
}

// Drawer (mobile)
const drawerVisible = ref(false);

function navigate(itemRoute: string):void {
  router.push(itemRoute);
  drawerVisible.value = false;
}

// Avatar
const avatarUrl = useAvatarUrl(loggedUser?.id);
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Desktop fixed sidebar -->
    <aside class="hidden lg:flex flex-col w-64 shrink-0 fixed inset-y-0 left-0 bg-stone-800 z-10">
      <!-- Logo -->
      <div class="flex items-center gap-3 px-5 py-5 border-b border-stone-700">
        <i class="pi pi-book text-amber-400 text-2xl"></i>
        <span class="text-stone-50 font-bold text-xl tracking-wide">Kniho-hlod</span>
      </div>

      <!-- Nav items -->
      <nav class="flex-1 overflow-y-auto py-3 px-2">
        <button
          v-for="item in navItems"
          :key="item.route"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-left transition-colors relative"
          :class="
            isActive(item.route)
              ? 'bg-amber-500/20 text-amber-300 font-semibold'
              : 'text-stone-400 hover:bg-stone-700 hover:text-stone-50'
          "
          @click="navigate(item.route)"
        >
          <i :class="item.icon" class="text-base w-5 text-center shrink-0"></i>
          <span class="text-sm">{{ item.label() }}</span>
          <span
            v-if="item.badge && item.badge() > 0"
            class="ml-auto bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1"
          >
            {{ item.badge() }}
          </span>
        </button>
      </nav>

      <!-- User section -->
      <div class="border-t border-stone-700 p-3">
        <div class="flex items-center gap-2 px-2 py-2 mb-1">
          <Avatar
            :image="avatarUrl || undefined"
            :icon="avatarUrl ? undefined : 'pi pi-user'"
            shape="circle"
            size="small"
            class="shrink-0"
          />
          <span class="text-stone-200 text-sm font-medium truncate">
            {{ loggedUser?.username }}
          </span>
        </div>

        <!-- Language + Dark mode row -->
        <div class="flex items-center gap-1 px-2 pb-1">
          <Button
            label="CS"
            :text="locale !== 'cs'"
            size="small"
            @click="setLocale('cs')"
          />
          <Button
            label="EN"
            :text="locale !== 'en'"
            size="small"
            @click="setLocale('en')"
          />
          <Button
            :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
            text
            size="small"
            class="ml-auto"
            :aria-label="t('topbar.toggleDark')"
            @click="toggle"
          />
        </div>

        <button
          class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-400 hover:bg-stone-700 hover:text-stone-50 transition-colors text-sm"
          @click="logOut"
        >
          <i class="pi pi-sign-out w-5 text-center"></i>
          <span>{{ t('nav.logout') }}</span>
        </button>
      </div>
    </aside>

    <!-- Main area -->
    <div class="flex-1 lg:ml-64 flex flex-col min-h-screen">
      <!-- Mobile top bar -->
      <header
        class="lg:hidden sticky top-0 z-20 bg-stone-800 flex items-center justify-between px-4 h-14 border-b border-stone-700"
      >
        <div class="flex items-center gap-3">
          <Button
            icon="pi pi-bars"
            text
            severity="secondary"
            class="!text-stone-200"
            aria-label="Open menu"
            @click="drawerVisible = true"
          />
          <div class="flex items-center gap-2">
            <i class="pi pi-book text-amber-400"></i>
            <span class="text-stone-50 font-bold">Kniho-hlod</span>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <Button label="CS" :text="locale !== 'cs'" size="small" @click="setLocale('cs')" />
          <Button label="EN" :text="locale !== 'en'" size="small" @click="setLocale('en')" />
          <Button
            :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
            text
            size="small"
            :aria-label="t('topbar.toggleDark')"
            @click="toggle"
          />
          <Avatar :image="avatarUrl || undefined" :icon="avatarUrl ? undefined : 'pi pi-user'" shape="circle" size="small" />
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto relative">
        <!-- Background image - fixed, blurred -->
        <div class="fixed inset-0 bg-hlod bg-cover bg-no-repeat blur-sm opacity-70 dark:opacity-20 -z-10"></div>
        <!-- Color overlay for readability -->
        <div class="fixed inset-0 bg-white/65 dark:bg-stone-950/75 -z-10"></div>
        <!-- Content -->
        <div class="p-4 lg:p-6">
          <router-view />
        </div>
      </main>
    </div>

    <!-- PrimeVue Drawer (mobile) -->
    <Drawer v-model:visible="drawerVisible" :modal="true" position="left" class="!w-72">
      <template #header>
        <div class="flex items-center gap-2">
          <i class="pi pi-book text-primary-500"></i>
          <span class="font-bold text-lg">Kniho-hlod</span>
        </div>
      </template>

      <!-- User info -->
      <div class="flex items-center gap-3 py-3 mb-2 border-b border-surface-200">
        <Avatar :image="avatarUrl || undefined" :icon="avatarUrl ? undefined : 'pi pi-user'" shape="circle" class="shrink-0" />
        <div>
          <p class="font-medium text-surface-700 text-sm">{{ loggedUser?.username }}</p>
          <p class="text-surface-400 text-xs">{{ loggedUser?.email }}</p>
        </div>
      </div>

      <!-- Nav items -->
      <nav class="flex flex-col gap-0.5">
        <button
          v-for="item in navItems"
          :key="item.route"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors"
          :class="
            isActive(item.route)
              ? 'bg-primary-50 text-primary-700 font-semibold dark:bg-amber-900/30 dark:text-amber-300'
              : 'text-surface-600 hover:bg-surface-100'
          "
          @click="navigate(item.route)"
        >
          <i :class="item.icon" class="text-base w-5 text-center shrink-0"></i>
          <span class="text-sm">{{ item.label() }}</span>
          <span
            v-if="item.badge && item.badge() > 0"
            class="ml-auto bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1"
          >
            {{ item.badge() }}
          </span>
        </button>
      </nav>

      <template #footer>
        <Button
          :label="t('nav.logout')"
          icon="pi pi-sign-out"
          severity="secondary"
          text
          fluid
          @click="logOut"
        />
      </template>
    </Drawer>
  </div>
</template>
