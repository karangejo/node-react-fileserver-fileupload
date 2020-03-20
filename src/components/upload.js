import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import axios from  'axios';


function Upload() {

  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);

  const uploadFile = (event) => {
    if(files.length <= 1){
      console.log("selected one");
      console.log(files);
      const formData = new FormData();
      formData.append('uploadedFile',files[0])
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
    } else {
      console.log("selected many");
      console.log(files);
      const formData = new FormData();
      //append all files to formData
      for(var file of files){
        formData.append('uploadedFiles',file)
      }
      const config = {
         headers: {
             'content-type': 'multipart/form-data'
         }
       }
      axios.post('http://localhost:3030/upload-files', formData, config)
        .then(() => {
          console.log("files Saved");
        })
        .catch((err) => {
          console.log(err);
        });
    }

  }

  const getNamesFromFiles = (fileArray) => {
    let namesArray = [];
    for(var i in fileArray){
      namesArray.push(fileArray[i].name);
    }
    setFileNames(namesArray);
  }

  const getFiles = (fileArray) => {
    let returnArray = [];
    console.log(fileArray)
    for(var i in fileArray){
      if(typeof fileArray[i] == 'object'){
        returnArray.push(fileArray[i]);
      }
    }
    return(returnArray);
  }

  const changedFile = (event) => {
    const uploadedFiles = event.target.files
    const fileArray = getFiles(uploadedFiles);
    setFiles(fileArray);
    if(fileArray.length <=1){
       setFileNames([fileArray[0].name]);
    } else {
      getNamesFromFiles(fileArray);
    }
  }

  const displayFileNames = () => {
    const items = fileNames.map((value, index) => {
      return(
        <Alert key={index} severity="success">{value}</Alert>
      );
    });
    return(fileNames ? items : null);
  }

  return (
    <Grid container direction="column" justify="center" alignItems="flex-start">
      <Grid container direction="row" justify="flex-start" alignItems="center" >
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
          {displayFileNames()}
        </Grid>
        <Button variant="contained" color="primary" component="span" onClick={uploadFile}>
          Upload
        </Button>
    </Grid>
  );
}


export default Upload;
