import { Card, CardContent, Box, Skeleton, Stack } from "@mui/material";

export default function DashboardCardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="circular" width={48} height={48} />
          </Box>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="50%" height={20} />
        </Stack>
      </CardContent>
    </Card>
  );
}

