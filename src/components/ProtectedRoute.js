"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PageLoader from "@/app/loading";
import { PUBLIC_ROUTES, ADMIN_ROUTES, USER_ROUTES, ROUTE_REDIRECTS } from "@/constants/routes";

// Helper function to check if pathname matches a route pattern
function matchesRoute(pathname, routes) {
  return routes.some((route) => {
    if (pathname === route) return true;
    if (pathname.startsWith(route + "/")) return true;
    return false;
  });
}

export default function ProtectedRoute({ children }) {
  const { role, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Memoize route type checks to prevent unnecessary recalculations
  const isPublicRoute = useMemo(() => matchesRoute(pathname, PUBLIC_ROUTES), [pathname]);
  const isAdminRoute = useMemo(() => matchesRoute(pathname, ADMIN_ROUTES), [pathname]);
  const isUserRoute = useMemo(() => matchesRoute(pathname, USER_ROUTES), [pathname]);
  
  // Check if route is invalid (not in any route category)
  const isValidRoute = useMemo(() => isPublicRoute || isAdminRoute || isUserRoute, [isPublicRoute, isAdminRoute, isUserRoute]);
  
  useEffect(() => {
    // For public routes, allow access immediately
    if (isPublicRoute) {
      setIsChecking(false);
      return;
    }

    // If route is invalid, redirect to not-found
    if (!isValidRoute) {
      setIsChecking(false);
      router.replace('/not-found');
      return;
    }

    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // Now we can check access
    setIsChecking(false);

    // Check if user is not logged in - redirect to login
    if (!user || !role) {
      router.replace(ROUTE_REDIRECTS.login);
      return;
    }

    // Check if route requires admin but user is not admin
    if (isAdminRoute && role !== "admin") {
      router.replace(ROUTE_REDIRECTS.default);
      return;
    }

    // Check if route is user-only but accessed by admin - redirect to admin dashboard
    if (isUserRoute && role === "admin") {
      router.replace(ROUTE_REDIRECTS.admin);
      return;
    }

    // Check if route is user-only but user is not a regular user
    if (isUserRoute && role !== "user") {
      router.replace(ROUTE_REDIRECTS.login);
      return;
    }
  }, [pathname, role, user, authLoading, router, isPublicRoute, isAdminRoute, isUserRoute, isValidRoute, isChecking]);

  // Allow public routes to render immediately
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // If route is invalid, show loading while redirecting to not-found
  if (!isValidRoute) {
    return <PageLoader />;
  }

  // Show loading while checking auth
  if (authLoading || isChecking) {
    return (
      <PageLoader />
    );
  }

  // If not logged in and trying to access protected route, block and redirect
  if (!user || !role) {
    return <PageLoader />;
  }

  // Check if route requires admin but user is not admin - block access
  if (isAdminRoute && role !== "admin") {
    return <PageLoader />;
  }

  // Check if user route accessed by admin - block access
  if (isUserRoute && role === "admin") {
    return <PageLoader />;
  }

  // Check if user route but user is not a regular user
  if (isUserRoute && role !== "user") {
    return <PageLoader />;
  }

  // All checks passed - allow access
  return <>{children}</>;
}

