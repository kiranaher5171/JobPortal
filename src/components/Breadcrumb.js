"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { Typography, Stack } from '@mui/material';
import { IoIosArrowForward } from "react-icons/io";

const Breadcrumb = () => {
    const pathname = usePathname();
    
    // Generate breadcrumb items based on pathname
    const generateBreadcrumbs = () => {
        const pathSegments = pathname.split('/').filter(segment => segment !== '');
        
        // If we're on home page, just show greeting
        if (pathname === '/') {
            return (
                <Typography variant='h5' className="fw5 text">
                    Good Morning Kiran
                </Typography>
            );
        }
        
        const breadcrumbItems = [];
        
        // Map path segments to readable names
        const pathMap = {
            'home': 'Home',
            'reimbursements': 'Reimbursements',
            'reimbursements-details': 'Reimbursement Details',
            'user-and-roles': 'User & Roles',
            'esn-report': 'ESN Report'
        };
        
        // Add breadcrumb items for each path segment
        pathSegments.forEach((segment, index) => {
            const displayName = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
            
            if (index === 0) {
                // First item doesn't need an arrow
                breadcrumbItems.push(
                    <Typography key={`segment-${index}`} variant='h5' className="fw5 text">
                        {displayName}
                    </Typography>
                );
            } else {
                // Subsequent items need arrows
                breadcrumbItems.push(
                    <React.Fragment key={`arrow-${index}`}>
                        <IoIosArrowForward className='text' />
                        <Typography variant='h5' className="fw5 text">
                            {displayName}
                        </Typography>
                    </React.Fragment>
                );
            }
        });
        
        return breadcrumbItems;
    };

    return (
        <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
            {generateBreadcrumbs()}
        </Stack>
    );
};

export default Breadcrumb;
