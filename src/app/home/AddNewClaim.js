"use client";
import React from 'react'
import { Autocomplete, Box,Grid , Chip, IconButton, TextField, Typography } from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import { Button, Stack } from "@mui/material";
 import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SimpleDatePicker from '@/components/SimpleDatePicker';
import PdfDropzone from '@/components/UploadDropzone';
import Link from 'next/link';
import PeriodSelection from '@/components/PeriodSelection';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';



const dummyOptions = [
    { label: 'Option 1' },
    { label: 'Option 2' },
    { label: 'Option 3' },
    { label: 'Option 4' },
    { label: 'Option 5' },
]

const dummyParticipants = [
    { label: '0000 | Employee Name' },
    { label: '0001 | Employee Name' },
    { label: '0002 | Employee Name' },
    { label: '0003 | Employee Name' },
    { label: '0004 | Employee Name' },
]



const AddNewClaim = () => {
    // For Dialog
    const [open, setOpen] = React.useState(false);

    const handleOpen = (user) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [selected, setSelected] = React.useState([]);


    return (
        <>

            <Button variant='contained' className='btn-primary-contained' onClick={handleOpen} startIcon={<IoMdAdd />}>New Claim</Button>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle id="scroll-dialog-title">
                    <Typography variant='h5' className='fw6 black'>Submit New Expense Claim</Typography>
                </DialogTitle>

                <DialogContent>


                    <Grid container spacing={3} alignItems="flex-start" justifyContent="flex-start">
                        {/* <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}> */}
                        {/* <Box className='textfield auto-complete'>
                                <Typography variant='body1' className='label'>Availing period</Typography>
                                <Autocomplete
                                    disablePortal
                                    options={dummyOptions}
                                    fullWidth
                                    renderInput={(params) => (
                                      <Box className="textfield">
                                        <TextField {...params} placeholder="Select Availing Period" variant='outlined' />
                                      </Box>
                                    )}
                                />
                            </Box> */}
                        {/* <Box className='textfield auto-complete'>
                                <Typography variant='body1' className='label'>Total amount</Typography>
                                <TextField placeholder="Enter Amount" variant='outlined' fullWidth />
                            </Box> */}
                        {/* </Grid> */}

                        {/* <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                            <Box className='textfield auto-complete'>
                                <Typography variant='body1' className='label'>Date of Expenses</Typography>
                                <SimpleDatePicker />
                            </Box>
                        </Grid> */}

                        <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                            <Box className='textfield auto-complete'>
                                <Typography variant='body1' className='label'>Date of Expenses</Typography>
                                <SimpleDatePicker />
                            </Box>

                            <Box className='textfield auto-complete' mt={3}>
                                <Typography variant='body1' className='label'>Total amount</Typography>
                                <Box className="textfield">
                                  <TextField placeholder="Enter Amount" variant='outlined' fullWidth />
                                </Box>
                            </Box>


                            <Box className='textfield auto-complete' mt={3}>
                                <Typography variant='body1' className='label'>City name</Typography>
                                <Autocomplete
                                    disablePortal
                                    options={dummyOptions}
                                    fullWidth
                                    renderInput={(params) => (
                                      <Box className="textfield">
                                        <TextField {...params} placeholder="Select" variant='outlined' />
                                      </Box>
                                    )}
                                />
                            </Box>

                            <Box className='textfield auto-complete' mt={3}>
                                <Typography variant='body1' className='label'>Recipient</Typography>
                                <Autocomplete
                                    disablePortal
                                    options={dummyOptions}
                                    fullWidth
                                    renderInput={(params) => (
                                      <Box className="textfield">
                                        <TextField {...params} placeholder="Select" variant='outlined' />
                                      </Box>
                                    )}
                                />
                            </Box>
                        </Grid>

                        <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                            <Box className='textfield auto-complete'>
                                <Typography variant='body1' className='label'>Bill Upload</Typography>
                                <PdfDropzone />
                                <Box id="uploaded-file-chips" mt={2}>
                                    <List disablePadding>
                                        <ListItem
                                            disablePadding
                                            disableGutters
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary="File Name Here"
                                                secondary="0.10MB"
                                            />
                                        </ListItem>
                                        <ListItem
                                            disablePadding
                                            disableGutters
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary="File Name Here"
                                                secondary="0.10MB"
                                            />
                                        </ListItem>
                                        <ListItem
                                            disablePadding
                                            disableGutters
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemText
                                                primary="File Name Here"
                                                secondary="0.10MB"
                                            />
                                        </ListItem>
                                    </List>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
                            <Box className='textfield auto-complete'>
                                <Typography variant='body1' className='label'>Availing period</Typography>
                                <Autocomplete
                                    disablePortal
                                    options={dummyOptions}
                                    fullWidth
                                    renderInput={(params) => (
                                      <Box className="textfield">
                                        <TextField {...params} placeholder="Select Availing Period" variant='outlined' />
                                      </Box>
                                    )}
                                />
                            </Box>
                        </Grid>

                        <Grid size={{ lg: 8, md: 8, sm: 12, xs: 12 }}>
                            <Box className='textfield auto-complete multi-select'>
                                <Typography variant='body1' className='label'>Participants</Typography>
                                <Autocomplete
                                    disablePortal
                                    multiple
                                    options={dummyParticipants}
                                    fullWidth
                                    value={selected}
                                    onChange={(event, newValue) => setSelected(newValue)}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                      <Box className="textfield">
                                        <TextField {...params} placeholder="Select Colleagues" variant='outlined' />
                                      </Box>
                                    )}
                                />
                                {selected.length > 0 && (
                                    <Box mt={1} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {selected.map((item, index) => (
                                            <Chip
                                                key={index}
                                                label={<Box className="fx_fs gap1">{item.label} </Box>}
                                                onDelete={() => setSelected((prev) => prev.filter((v) => v.label !== item.label))}
                                            />
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Grid>


                        <Grid size={{ lg: 4, md: 4, sm: 12, xs: 12 }}>
                            <Box className='textfield auto-complete'>
                                <Typography variant='body1' className='label'>Availing period</Typography>
                                <Autocomplete
                                    disablePortal
                                    options={dummyOptions}
                                    fullWidth
                                    renderInput={(params) => (
                                      <Box className="textfield">
                                        <TextField {...params} placeholder="Select Availing Period" variant='outlined' />
                                      </Box>
                                    )}
                                />
                            </Box>
                        </Grid>

                        <Grid size={{ lg: 8, md: 8, sm: 12, xs: 12 }}>
                            <Box className='textfield auto-complete multi-select'>
                                <Typography variant='body1' className='label'>Participants</Typography>
                                <Autocomplete
                                    disablePortal
                                    multiple
                                    options={dummyParticipants}
                                    fullWidth
                                    value={selected}
                                    onChange={(event, newValue) => setSelected(newValue)}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                      <Box className="textfield">
                                        <TextField {...params} placeholder="Select Colleagues" variant='outlined' />
                                      </Box>
                                    )}
                                />
                                {selected.length > 0 && (
                                    <Box mt={1} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {selected.map((item, index) => (
                                            <Chip
                                                key={index}
                                                label={<Box className="fx_fs gap1">{item.label} </Box>}
                                                onDelete={() => setSelected((prev) => prev.filter((v) => v.label !== item.label))}
                                            />
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                            <Box className='textfield auto-complete'>
                                <Typography variant='body1' className='label'>Comments</Typography>
                                <Box className="textfield">
                                  <TextField placeholder="Add Any Information" multiline rows={1} variant='outlined' fullWidth />
                                </Box>
                            </Box>
                        </Grid>

                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button variant='outlined' className='btn-tertiary-outlined' onClick={handleClose}>Close</Button>
                    <Link href="/reimbursements-details">
                        <Button variant='contained' className='btn-primary-contained'>Submit Claim</Button>
                    </Link>
                </DialogActions>
            </Dialog>



        </>
    );
};

export default AddNewClaim;
