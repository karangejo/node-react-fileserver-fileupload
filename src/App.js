import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import axios from  'axios';


function App() {

  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('');

  const uploadFile = (event) => {
    console.log("selected");
    console.log(file);
    const formData = new FormData();
    formData.append('uploadedFile',file)
    const config = {
       headers: {
           'content-type': 'multipart/form-data'
       }
     }
    axios.post('http://localhost:3030/upload-file', formData, config)
      .then(() => {
        console.log("file Saved");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const changedFile = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  }

  return (
    <Grid container direction="column" justify="center">
      <Grid container direction="row" >
        <input
            onChange={changedFile}
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" color="primary" component="span" >
              Choose
            </Button>
          </label>
          {fileName ? <Alert severity="success">{fileName}</Alert> : null}
        </Grid>
        <Button variant="contained" color="primary" component="span" onClick={uploadFile}>
          Upload
        </Button>
    </Grid>
  );
}


export default App;
