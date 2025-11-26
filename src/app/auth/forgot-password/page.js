"use client";
import { Box, Container, Grid, Typography } from "@mui/material";
import Form from "./Form";
import FormLayout from "@/layouts/FormLayout";

const page = () => {
  return (
    <FormLayout>
      <Box id="form-bg">
      <Container maxWidth="lg" className="main-container">
        <Grid
          container
          alignItems="flex-end"
          justifyContent="center"
          style={{ height: "100vh" }}
        >
          <Grid size={{ xs: 12, sm: 4, md: 6, lg: 7 }}>
            <Box>
              <Box className="form-side-text">
                <Typography
                  variant="h1"
                  className="main-txt"
                  gutterBottom
                  pt={1}
                >
                  Empowering Contractors
                </Typography>

                <Typography variant="h4" className="sub-txt">
                  Analyze, Communicate, Resolve Field Issues
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Section */}
          <Grid size={{ xs: 12, sm: 8, md: 6, lg: 5 }}>
            <Form />
          </Grid>
        </Grid>
      </Container>
    </Box>
    </FormLayout>
  );
};

export default page;
