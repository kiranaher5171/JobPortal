/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        // Disable ESLint during build
        ignoreDuringBuilds: true,
    },
    // Performance optimizations
    compress: true,
    poweredByHeader: false,
    // swcMinify is enabled by default in Next.js 15, no need to specify
    experimental: {
        // Enable React compiler if needed
        optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    },
    // Enable prefetching for faster navigation
    onDemandEntries: {
        // Period (in ms) where the server will keep pages in the buffer
        maxInactiveAge: 60 * 1000, // Increased to 60 seconds
        // Number of pages that should be kept simultaneously without being disposed
        pagesBufferLength: 5, // Increased buffer for better performance
    },
    // Enable static page generation optimization (commented out for development)
    // output: 'standalone',
    // Optimize images
    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    // Compress responses (already set above, removed duplicate)
    // Optimize production builds
    productionBrowserSourceMaps: false,
    async rewrites() {
        return [
            {
                source: '/home',
                destination: '/home/',
            },
            {
                source: '/',
                destination: '/auth/login',
            },
            {
                source: '/forgot-password',
                destination: '/auth/forgot-password',
            },
            {
                source: '/reset-password',
                destination: '/auth/reset-password',
            },
            {
                source: '/password-updated',
                destination: '/auth/password-updated',
            },
        ];
    },
    async headers() {
        return [
            {
                // Apply security headers to all routes
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
                            "style-src 'self' 'unsafe-inline'",
                            "img-src 'self' data: https:",
                            "font-src 'self' data:",
                            "connect-src 'self'",
                            "frame-ancestors 'none'",
                        ].join('; '),
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
