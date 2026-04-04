import router from '@/router';
import type { User } from '@/types/entities';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getServices } from '@kniho-hlod/kniho-hlod-service';
import { useBookStore } from '@/features/books/store';
import { useLoanStore } from '@/features/loans/store';
import { useUserStore } from '@/features/users/store';
import { useTokenManager } from '@/shared/composables/use-token-manager';
import { useNotification } from '@/shared/composables/use-notification';
import { useFileStore } from '@/features/account/store';

export const authorizationStore = defineStore('authorization', () => {
  const tokenManager = useTokenManager('auth-token');
  const { showInfo } = useNotification();

  // State
  const actualRole = ref('');
  const actualUsername = ref('');
  const isAuthenticated = ref(false);
  const isAuthInitialized = ref(false);

  // Actions
  async function handleLogin(userCredentials: { email: string; password: string }): Promise<void> {
    try {
      const userData = await getServices().auth.login(userCredentials);

      tokenManager.setToken(userData.token);
      tokenManager.setTokenExpiration(userData.token, () => {
        logOut();
      });

      isAuthenticated.value = true;
      actualUsername.value = userData.email;
      actualRole.value = userData.role;

      await Promise.all([
        useUserStore().fetchEntities(),
        useBookStore().fetchEntities(),
        useLoanStore().fetchEntities(),
        useFileStore().fetchEntities(),
      ]);

      isAuthInitialized.value = true;
      router.push('/home');
    } catch (error) {
      throw error;
    }
  }

  function logOut(): void {
    router.push('/login');
    tokenManager.removeToken();
    isAuthenticated.value = false;
    actualRole.value = '';
    actualUsername.value = '';
    showInfo('Odhlášení', 'Byl jsi úspěšně odhlášen.');
  }

  async function initializeAuth(): Promise<void> {
    const token = tokenManager.getToken();
    if (token && !tokenManager.isTokenExpired()) {
      const tokenData = tokenManager.getTokenData();
      if (tokenData) {
        isAuthenticated.value = true;
        actualUsername.value = tokenData.email;
        actualRole.value = tokenData.role;
        tokenManager.setTokenExpiration(token, () => {
          logOut();
        });
      }
      await Promise.all([
        useUserStore().fetchEntities(),
        useBookStore().fetchEntities(),
        useLoanStore().fetchEntities(),
        useFileStore().fetchEntities(),
      ]);
    } else if (token) {
      logOut();
    }
    isAuthInitialized.value = true;
  }

  // Getters
  const loggedUser = computed<User | null>(() => {
    return useUserStore().entities.find((user) => user.email === actualUsername.value) ?? null;
  });

  function isLoggedIn(): boolean {
    return isAuthenticated.value && !tokenManager.isTokenExpired();
  }

  return {
    // State
    actualRole,
    actualUsername,
    isAuthenticated,
    // Actions
    handleLogin,
    logOut,
    initializeAuth,
    isAuthInitialized,
    getToken: tokenManager.getToken,
    isTokenExpired: tokenManager.isTokenExpired,
    // Getters
    loggedUser,
    isLoggedIn,
  };
});
