/**
 * Application Route Constants
 * Centralized route definitions for consistency
 */

export const PUBLIC_ROUTES = [
  '/',
  '/home',
  '/about',
  '/contact',
  '/not-found',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export const ADMIN_ROUTES = [
  '/admin/dashboard',
  '/admin/jobs',
  '/admin/manage-users',
  '/admin/saved-jobs',
  '/admin/referrals',
  '/admin/applications',
  '/admin/settings',
];

export const USER_ROUTES = [
  '/users/jobs',
  '/users/saved-jobs',
  '/users/my-applications',
  '/users/profile',
];

export const ROUTE_REDIRECTS = {
  admin: '/admin/dashboard',
  user: '/users/jobs',
  default: '/home',
  login: '/auth/login',
};

