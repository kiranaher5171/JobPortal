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
            justifyContent="flex-end" 
            alignItems="center" 
            sx={{width:"100%"}}
          >
            {/* <Grid size={{ lg: 7, md: 6, sm: 4, xs: 12 }}>
              <Box>
                <Box className="form-side-text">
                  <Typography
                    variant="h1"
                    className="main-txt"
                    gutterBottom
                    pt={1}
                  >
                   &nbsp
                  </Typography>

                  <Typography variant="h4" className="sub-txt">
                    Analyze, Communicate, Resolve Field Issues
                  </Typography>
                </Box>
              </Box>
            </Grid> */}

            {/* Right Section */}
            <Grid size={{ lg: 5, md: 8, sm: 10, xs: 12 }}>
              <Form />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </FormLayout>
  );
};

export default page;
