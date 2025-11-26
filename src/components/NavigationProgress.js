"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Box, LinearProgress } from "@mui/material";

/**
 * Navigation Progress Bar
 * Shows a progress bar at the top when navigating between pages
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show loading when route changes
    setLoading(true);
    
    // Hide loading after a short delay (allows page to render)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: 3,
      }}
    >
      <LinearProgress
        sx={{
          height: 3,
          "& .MuiLinearProgress-bar": {
            transition: "transform 0.2s linear",
          },
        }}
      />
    </Box>
  );
}

