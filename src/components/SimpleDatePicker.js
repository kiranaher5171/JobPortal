"use client";
import { Box } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const SimpleDatePicker = ({ label, value, onChange }) => {
    const [selectedDate, setSelectedDate] = useState(value ? dayjs(value) : null);

    useEffect(() => {
        if (value) {
            setSelectedDate(dayjs(value));
        } else {
            setSelectedDate(null);
        }
    }, [value]);

    const handleDateChange = (newValue) => {
        const formattedDate = newValue ? dayjs(newValue).format('YYYY-MM-DD') : null;
        setSelectedDate(newValue);
        if (onChange) {
            onChange(formattedDate);
        }
    };

    return (
        <Box className="textfield datepicker">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label={label}
                    value={selectedDate}
                    onChange={handleDateChange}
                    slotProps={{
                        textField: { size: 'small', fullWidth: true },
                    }}
                />
            </LocalizationProvider>
        </Box>
    );
};

export default SimpleDatePicker;
