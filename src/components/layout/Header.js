'use client';
import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListSubheader,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import logo from '/assets/dpa_logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProfileMenus from '@/components/ProfileMenus';
import { ROUTE_REDIRECTS } from '@/constants/routes';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, user, logout, loading } = useAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  // Memoize scroll handler to prevent unnecessary re-renders
  const handleScroll = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    // Apply background on any scroll
    setScrolled(window.scrollY > 0);
  }, []);

  React.useEffect(() => {
    // Initial check
    handleScroll();
    
    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };
  const handleDrawerClose = () => setDrawerOpen(false);

  const handleLogout = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleDrawerClose();
    // Small delay to ensure menu/drawer closes before navigation
    setTimeout(async () => {
      await logout();
      // Redirect to home page after logout using window.location for immediate redirect
      // This prevents ProtectedRoute from redirecting to /auth/login
      window.location.href = "/home";
    }, 100);
  };

  // Memoize menu items to prevent unnecessary re-renders
  const adminMenuItems = React.useMemo(() => [
    { label: "Admin Dashboard", href: "/admin/dashboard" },
    { label: "Manage Jobs", href: "/admin/jobs" },
    { label: "Manage Users", href: "/admin/manage-users" },
    { label: "Applications", href: "/admin/applications" },
    { label: "Settings", href: "/admin/settings" },
  ], []);

  const userMenuItems = React.useMemo(() => [
    { label: "Find Jobs", href: "/users/jobs" },
    { label: "My Applications", href: "/users/my-applications" },
    { label: "Saved Jobs", href: "/users/saved-jobs" },
    { label: "Profile", href: "/users/profile" },
  ], []);

  const publicMenuItems = React.useMemo(() => [], []);

  // Determine menu items based on authentication state
  const menuItems = React.useMemo(() => {
    return role === "admin" ? adminMenuItems : role === "user" ? userMenuItems : publicMenuItems;
  }, [role, adminMenuItems, userMenuItems, publicMenuItems]);
  
  // Show public menu while loading or when not logged in
  const isLoggedIn = React.useMemo(() => !loading && role && user, [loading, role, user]);

  // Determine if AppBar should have background
  // If logged in: always show background
  // If not logged in: only show background on scroll
  const shouldShowBackground = React.useMemo(() => {
    return isLoggedIn || scrolled;
  }, [isLoggedIn, scrolled]);

  // Memoize helper function to check if a menu item should be active
  const isMenuActive = React.useCallback((menuHref, currentPathname) => {
    // Exact match
    if (currentPathname === menuHref) {
      return true;
    }
    // For nested routes, check if pathname starts with menu href
    if (currentPathname.startsWith(menuHref + "/")) {
      return true;
    }
    return false;
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        id="Appbar"
        position="fixed"
        className={`Appbar_height ${shouldShowBackground ? 'scrolled' : ''}`}
        elevation={0} // no shadow initially
        sx={{ 
          paddingRight: 0,
        }}
      >
        <Toolbar className='fx_sb'>

                {/* Logo - Left */}
                <Box component="nav" aria-label="Main navigation" >
        <IconButton
            size="small"
            edge="end"
            onClick={toggleDrawer}
            className="drawer_btn mobile_menus"
            aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={drawerOpen}
            aria-controls="mobile-menu"
            sx={{ 
              marginRight: 1,
            }}
          >
            {drawerOpen ? (
              <CloseIcon className="white" aria-hidden="true" />
            ) : (
              <MenuIcon className="white" aria-hidden="true" />
            )}
          </IconButton>
                  <Link 
                    href={role === "admin" ? "/admin/dashboard" : role === "user" ? "/users/jobs" : "/home"} 
                    prefetch={true}
                    aria-label="Job Portal Home"
                  >
                     {/* <Image
                      src={logo}
                      alt="Job Portal Logo"
                      width={120}
                      height={40}
                      className="appbar_logo"
                      priority
                    />  */}
                     <Typography variant='h6' className='white fw6 footer-heading' component="span">Job Portal</Typography>
                  </Link>
                </Box>

          {/* Desktop Menu - Center */}
          <Box 
            component="nav"
            aria-label="Main menu"
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              gap: 1, 
              alignItems: 'center', 
              flexGrow: 1, 
              justifyContent: 'center',
              mx: 2
            }}
          >
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} prefetch={true} aria-label={`Navigate to ${item.label}`}>
                <Button 
                  disableRipple 
                  className={`menus ${isMenuActive(item.href, pathname) ? 'active' : ''}`}
                  aria-current={isMenuActive(item.href, pathname) ? 'page' : undefined}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>

          {/* Profile Menu / Login Button - Right */}
          <Box sx={{ display: {md: 'flex' },justifyContent:"flex-end", alignItems: 'center', gap: 1 }}>
            {/* Show profile menu only when logged in */}
            {isLoggedIn && <ProfileMenus />}
            {/* Show Login button only when NOT logged in */}
            {!isLoggedIn && (
              <Link href="/auth/login" prefetch={true} aria-label="Navigate to login page"> 
               <Button 
                 variant="text" 
                 disableRipple 
                 className={`signin-btn ${pathname === '/auth/login' ? 'active' : ''}`}
                 aria-label="Sign In"
                 type="button"
               >
                  Sign In
                </Button> 
              </Link>
            )}
          </Box>

          {/* Mobile Drawer Icon - Toggle Button */}
         
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={handleDrawerClose}
        aria-label="Mobile navigation menu"
        id="mobile-menu"
      >
        <Box sx={{ width: 280 }} role="presentation" pt={2}>
          <List
            component="nav"
            aria-label="Mobile menu items"
            subheader={<ListSubheader component="div">Menu</ListSubheader>}
          >
            {menuItems.map((item) => (
              <React.Fragment key={item.href}>
                <Link href={item.href} prefetch={true}>
                  <ListItemButton disableRipple onClick={handleDrawerClose}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </Link>
                <Divider />
              </React.Fragment>
            ))}
            {!isLoggedIn && (
              <>
                <Link href="/auth/login" prefetch={true}>
                  <ListItemButton disableRipple onClick={handleDrawerClose}>
                    <ListItemText primary="Sign In" />
                  </ListItemButton>
                </Link>
                <Divider />
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

