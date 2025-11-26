"use client";
import MainLayout from "@/components/layout/MainLayout";
import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    // Set up the countdown timer
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount === 1) {
          // Redirect when countdown reaches 1
          clearInterval(timer);
          // Use a setTimeout to delay the push, avoiding the render issue
          setTimeout(() => router.push("/home"), 0);
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, [router]);

  return (
    <MainLayout>
      <Container maxWidth component="main">
        <Box
          height={"90vh"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          width={"100%"}
          component="section"
          aria-labelledby="not-found-heading"
        >
          <Box className="center" role="alert">
            <Image
              src="/under-dev.png"
              loading="lazy"
              draggable="false"
              alt="404 Page Not Found - Page under construction illustration"
              height={300}
              width={400}
              priority={false}
            />
            <Typography variant="h2" component="h2" gutterBottom>
              Page Not Found
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              The page you are looking for does not exist. It may be under
              construction or the URL may have been changed.
            </Typography>
            <Typography variant="body1" component="p" aria-live="polite" aria-atomic="true">
              Redirecting to homepage in {countdown} {countdown === 1 ? 'second' : 'seconds'}.
            </Typography>
          </Box>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default Page;
