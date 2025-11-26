import styles from "@/css/loading.module.css";
import { Box } from "@mui/material";

export default function PageLoader() {
  return (
    <Box className={styles.pageLoader} id="page-loader">
      <Box className={styles.loader} id="loader-6">
        <Box className={styles.dot}></Box>
        <Box className={styles.dot}></Box>
        <Box className={styles.dot}></Box>
        <Box className={styles.dot}></Box>
      </Box>
    </Box>
  );
}
