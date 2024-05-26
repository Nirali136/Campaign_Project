import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = () => {
  return (
    <div className='root_loader d-flex align-items-center justify-content-center'>
        <CircularProgress/>
    </div>
  )
}

export default Loader
