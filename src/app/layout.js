import "./root.css";
import localFont from "next/font/local";
import ThemeProviderComponent from "@/components/ThemeProviderComponent";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavigationProgress from "@/components/NavigationProgress";
import { Suspense } from "react";
import crypto from "crypto";

const poppins = localFont({
  src: [
    {
      path: "../../public/fonts/Poppins/Poppins-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/Poppins/Poppins-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Poppins/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Poppins/Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Poppins/Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Poppins/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Poppins/Poppins-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  display: "swap", // This tells the browser to use fallback fonts until the custom font is loaded
  variable: "--font-poppins",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1976d2",
};

export const metadata = {
  title: {
    default: "Job Portal - Find Your Dream Career",
    template: "%s | Job Portal",
  },
  description: "Discover thousands of job opportunities. Connect with top employers and find your perfect career match. Browse jobs by location, industry, and experience level.",
  keywords: ["jobs", "career", "employment", "job portal", "hiring", "recruitment", "job search", "career opportunities"],
  authors: [{ name: "Job Portal Team" }],
  creator: "Job Portal",
  publisher: "Job Portal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Job Portal",
    title: "Job Portal - Find Your Dream Career",
    description: "Discover thousands of job opportunities. Connect with top employers and find your perfect career match.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Job Portal - Find Your Dream Career",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Portal - Find Your Dream Career",
    description: "Discover thousands of job opportunities. Connect with top employers and find your perfect career match.",
    images: ["/og-image.jpg"],
    creator: "@jobportal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
  category: 'Job Portal',
  classification: 'Job Search Platform',
};

export default function RootLayout({ children }) {
  const nonce = crypto.randomBytes(16).toString("base64");

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Job Portal",
    description: "Discover thousands of job opportunities. Connect with top employers and find your perfect career match.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/users/jobs?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Job Portal",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    logo: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/assets/dpa_logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "Customer Service",
      email: "info@jobportal.com",
    },
  };

  // JobPosting structured data for better SEO
  const jobPostingData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "Job Portal - Find Your Dream Career",
    description: "Discover thousands of job opportunities. Connect with top employers and find your perfect career match.",
    employmentType: "FULL_TIME",
    workHours: "Full-time",
    datePosted: new Date().toISOString(),
    validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    hiringOrganization: {
      "@type": "Organization",
      name: "Job Portal",
      sameAs: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "US",
      },
    },
  };

  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"} />
      </head>
      <body className={poppins.className}>
        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobPostingData),
          }}
        />
        <ErrorBoundary>
          <ThemeProviderComponent nonce={nonce}>
            <AuthProvider>
              <Suspense fallback={null}>
                <NavigationProgress />
              </Suspense>
              <ProtectedRoute>
                <main id="main-content" role="main">{children}</main>
              </ProtectedRoute>
            </AuthProvider>
          </ThemeProviderComponent>
        </ErrorBoundary>
      </body>
    </html>
  );
}
