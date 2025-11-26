/**
 * Role Constants
 * Centralized role definitions
 */

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.USER]: 'User',
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'manage_jobs',
    'manage_users',
    'view_applications',
    'manage_settings',
    'view_dashboard',
  ],
  [ROLES.USER]: [
    'view_jobs',
    'apply_jobs',
    'save_jobs',
    'view_applications',
    'manage_profile',
  ],
};

