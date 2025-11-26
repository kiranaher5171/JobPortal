"use client";
import React from "react";
import { TextField, Button, Grid, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const JobSearchBar = ({ searchTerm, onSearchChange, onSearch }) => {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8 }}>
        <Box className="table-search" mt={1}>
          <TextField
            variant='outlined'
            size="small"
            placeholder='SEARCH'
            fullWidth
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search jobs"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize='small' />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{ height: "56px" }}
          className="primary"
          onClick={onSearch}
          aria-label="Search for jobs"
        >
          Search Jobs
        </Button>
      </Grid>
    </Grid>
  );
};

export default JobSearchBar;

