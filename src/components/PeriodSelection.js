import * as React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';

const names = [
    'Jan - Jun',
    'Jul - Dec',
];

export default function PeriodSelection() {
    const [personName, setPersonName] = React.useState([]);

    return (
        <>
            <Box className="textfield auto-complete" sx={{ m: 0, minWidth: 100 }}>
                <Autocomplete
                    multiple
                    size='small'
                    options={names}
                    value={personName}
                    onChange={(event, newValue) => {
                        setPersonName(newValue);
                    }}
                    renderInput={(params) => (
                        <Box className="textfield">
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Select Period"
                            />
                        </Box>
                    )}
                />
            </Box>
        </>
    );
}
