const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const mongoose = require('mongoose');
var fs = require('fs');


const FileMongo = require('./models/file');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

// connect to mongoDb
mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

//start app and serve files
app.use(express.static('uploads'));

const port = process.env.PORT || 3030;

app.listen(port, () =>
  console.log(`App is listening on port ${port}.`)
);



//save file info to mongoDb
const savePathToMongo = async (path, res) => {
  const mongoFile = new FileMongo({
                            date: new Date(),
                            path: path
                          })
  try {
    const newMongoFile = await mongoFile.save()
    console.log(newMongoFile);
  } catch (err) {
    console.log(err);
  }
}

app.post('/upload-files', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = [];

            //loop all files
            _.forEach(_.keysIn(req.files.uploadedFiles), (key) => {
                let file = req.files.uploadedFiles[key];

                //move file to uploads directory
                const filePath = './uploads/' + file.name;
                file.mv(filePath);

                //save to mongoDd
                savePathToMongo(filePath,res);

                //push file details
                data.push({
                    name: file.name,
                    mimetype: file.mimetype,
                    size: file.size
                });
            });

            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});



app.post('/upload-file', async (req, res) => {
    console.log(req.files);
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "newPhoto") to retrieve the uploaded file
            let newFile = req.files.uploadedFile;

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            const filePath = './uploads/' + newFile.name
            newFile.mv(filePath);

            savePathToMongo(filePath,res);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: newFile.name,
                    mimetype: newFile.mimetype,
                    size: newFile.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/file', async (req, res) => {
  var filePath = './uploads/' + req.body.filename;
  fs.unlinkSync(filePath);
  try {
    const deleted = await FileMongo.findOneAndDelete({path: filePath});
    console.log("deleted one record");
    res.send({
        status: true,
        message: 'File was deleted',
        data: {
            name: filePath,
        }
    })
  } catch (err) {
    console.log(err);
  }
});

app.get('/files', async (req, res) => {
  console.log("getting all files");
  try{
    const filesInfo = await FileMongo.find();
      res.status(200).json(filesInfo);
  } catch (err) {
    res.status(400).json({ message: err.message})
  }
})

app.get('/download', (req, res) => {
  console.log(req.query);
  const dirname = './uploads/'
  const file = dirname + req.query.fileName;
  console.log(file);
  try{
    res.download(file); // Set disposition and send it.
  } catch (err) {
    console.log(err);
    res.json({ message: err.message})
  }
});
