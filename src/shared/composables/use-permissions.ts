import { authorizationStore } from '@/stores/authorization-store';
import type { UserRole } from '@/features/users/constants';

export function usePermissions(): {
  isAllowed: (roles: UserRole[]) => boolean;
} {
  const { loggedUser } = authorizationStore();

  function isAllowed(roles: UserRole[]): boolean {
    const role = loggedUser?.role as UserRole | undefined;
    if (!role) return false;
    return roles.includes(role);
  }

  return { isAllowed };
}
