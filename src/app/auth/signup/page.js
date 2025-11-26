"use client";
import { Box, Container, Grid } from "@mui/material";
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
            {/* Right Section */}
            <Grid size={{ lg: 5, md: 6, sm: 8, xs: 12 }}>
              <Form />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </FormLayout>
  );
};

export default page;

