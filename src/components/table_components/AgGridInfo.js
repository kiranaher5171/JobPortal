import React from 'react'
import { Box, Typography } from '@mui/material'
import style from "./pagination.module.css"


const AgGridInfo = () => {
    return (
        <>
            <Box id={style.tableInfo}>
                <Typography variant='h6' className='txt fw5'>Showing 1 to 15 of <span className={style.totalEntries}>150 entries</span></Typography>
            </Box>
        </>
    )
}

export default AgGridInfo