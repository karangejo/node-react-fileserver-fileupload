import React from 'react';
import Grid from '@material-ui/core/Grid';
import Upload from './components/upload';
import Browse from './components/browse';

function App() {


  return (
    <Grid container direction="column" justify="center" alignItems="flex-start">
      <Upload/>
      <Browse/>
    </Grid>
  );
}


export default App;
