import * as React from 'react';
import usePagination from '@mui/material/usePagination';
import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';
import style from "./pagination.module.css";

const List = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
});

export default function AgGridPagination() {
  const { items } = usePagination({
    count: 12,
  });

  return (
    <>
      <Box className={style.pagination}>
        <nav>
          <List>
            {items.map(({ page, type, selected, ...item }, index) => {
              let children = null;

              if (type === 'start-ellipsis' || type === 'end-ellipsis') {
                children = '…';
              } else if (type === 'page') {
                children = (
                  <Button
                    className={`${style.paginateBtn} ${selected ? style.selectedBtn : ''}`}
                    type="button"
                    {...item}
                  >
                    {page}
                  </Button>
                );
              } else {
                children = (
                  <Button className={style.paginateBtn} type="button" {...item}>
                    {type}
                  </Button>
                );
              }

              return <li key={index}>{children}</li>;
            })}
          </List>
        </nav>
      </Box>
    </>
  );
}
