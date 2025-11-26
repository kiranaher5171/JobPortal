import { Box, Grid, Divider } from "@mui/material";
import Skeleton from '@mui/material/Skeleton';

export default function TableSkeleton() {

    return (
        <>
            <Box className="table-skeleton">
                <Grid container spacing={0} alignItems="center">
                    <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                        <Box pt={'4px'}>
                            <Skeleton variant="rectangular" width={'100%'} height={60} />
                            <Box pt={1}>
                                <Divider />
                            </Box>
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                            <Skeleton variant="text" sx={{ fontSize: '50px' }} />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
