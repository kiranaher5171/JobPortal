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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      const triggerHeight = pathname === '/' 
        ? window.innerHeight * 0.8 // 80vh for home page
        : window.innerHeight * 0.3; // 30vh for other pages
      if (window.scrollY > triggerHeight) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

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
      // Redirect to home page after logout
      window.location.href = "/home";
    }, 100);
  };

  // Admin menu items (Home removed - logo links to home)
  const adminMenuItems = [
    { label: "Admin Dashboard", href: "/admin/dashboard" },
    { label: "Manage Jobs", href: "/admin/jobs" },
    { label: "Manage Users", href: "/admin/manage-users" },
    { label: "Saved Jobs", href: "/admin/saved-jobs" },
    { label: "Referrals", href: "/admin/referrals" },
    { label: "Applications", href: "/admin/applications" },
    { label: "Settings", href: "/admin/settings" },
  ];

  // User menu items (Home removed - logo links to home)
  const userMenuItems = [
    { label: "Find Jobs", href: "/users/jobs" },
    { label: "My Applications", href: "/my-applications" },
    { label: "Saved Jobs", href: "/saved-jobs" },
    { label: "Profile", href: "/profile" },
  ];

  // Public menu items (when not logged in) - Home, About Us, and Contact Us
  const publicMenuItems = [
    // { label: "Home", href: "/home" },
    // { label: "About Us", href: "/about" },
    // { label: "Contact Us", href: "/contact" },
  ];

  // Show public menu while loading or when not logged in
  const isLoggedIn = !loading && role && user;
  
  // Determine menu items based on authentication state
  // When logged in, show role-specific menu regardless of current page
  // When not logged in (role is null/undefined), show public menu
  const menuItems = isLoggedIn 
    ? (role === "admin" ? adminMenuItems : userMenuItems)
    : publicMenuItems;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        id="Appbar"
        position="fixed"
        className={`Appbar_height ${scrolled ? 'scrolled' : ''}`}
        elevation={0} // no shadow initially
      >
        <Toolbar>
          {/* Logo - Left */}
          <Box>
            <Link href="/home">
               {/* <Image
                src={logo}
                alt="logo"
                width={120}
                height={40}
                className="appbar_logo"
                priority
              />  */}
               <Typography variant='h6' className='white fw6 footer-heading'>Job Portal</Typography>
            </Link>
          </Box>

          {/* Desktop Menu - Center */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            gap: 1, 
            alignItems: 'center', 
            flexGrow: 1, 
            justifyContent: 'center',
            mx: 2
          }}>
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button disableRipple className={`menus ${pathname === item.href ? 'active' : ''}`}>
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>

          {/* Profile Menu / Login Button - Right */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {/* Show profile menu only when logged in */}
            {isLoggedIn && <ProfileMenus />}
            {/* Show Login button only when NOT logged in */}
            {!isLoggedIn && (
              <Link href="/auth/login" passHref> 
               <Button variant="contained" disableRipple className={`signin-btn ${pathname === '/auth/login' ? 'active' : ''}`} >
               Sign In
                </Button> 
              </Link>
            )}
          </Box>

          {/* Mobile Drawer Icon - Toggle Button */}
          <IconButton
            size="small"
            edge="end"
            onClick={toggleDrawer}
            className="drawer_btn mobile_menus"
            aria-label="toggle drawer"
          >
            <MenuIcon className="white" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 280 }} role="presentation" pt={2}>
          <List
            component="nav"
            subheader={<ListSubheader component="div">Menu</ListSubheader>}
          >
            {menuItems.map((item) => (
              <React.Fragment key={item.href}>
                <Link href={item.href} passHref>
                  <ListItemButton disableRipple onClick={handleDrawerClose}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </Link>
                <Divider />
              </React.Fragment>
            ))}
            {!isLoggedIn && (
              <>
                <Box sx={{ p: 2 }}>
                  <Link href="/auth/login" passHref>
                    <Button variant='contained' disableRipple className="signin-btn" onClick={handleDrawerClose} fullWidth>
                    Sign In
                    </Button>
                  </Link>
                </Box>
                <Divider />
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
