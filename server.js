const express = require('express')
const multer = require("multer")
const app = express()
const port = 5000
const cors = require("cors")

app.use(cors());
app.listen(port, () => console.log(`Server listening on port ${port}!`))
   
// -----------------------------------DOWNLOAD FILE--------------------------------
app.get('/download/:filename', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    console.log("downloading", req.params.filename)
    download(req.params.filename)
    return res.send('DOWNLOAD SUCCESS')
})

// DOWNLOAD HELPER
async function download(srcFilename) {
    console.log("downloading...", srcFilename)

    const {Storage} = require("@google-cloud/storage")
    const storage = new Storage({
        projectId: 'imgur',
        keyFilename: '../imgur-backend/imgur-4ea0702af047.json'
    })

    const bucketName = "image_bucket_here"
    const destFilename = srcFilename.substring(srcFilename.lastIndexOf('/') + 1, srcFilename.length)

    const options = {
        destination: destFilename,
        validation: false //idk. it's giving error so imma turn validation off
    }

    await storage
        .bucket(bucketName)
        .file(srcFilename)
        .download(options);
    
    console.log(srcFilename, "downloaded to", destFilename)
}

// ------------------------- BROWSE FILE -----------------------------

// store selected image as "MyImage" in uplaods direcotry
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname)
    }
  })

var browse = multer({ storage: storage })

app.post('/browseFile', browse.single('myImage'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    res.send(file)
  })

// ---------------------------UPLOAD FILE------------------------------------
app.get('/upload', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    // console.log("user:", req.params.user, ", image-number:, ", req.params.number) 
    upload()
    return res.send('DOWNLOAD SUCCESS')
})


// UPLOAD HELPER
async function upload() {
    let filename = "uploads/myImage"
    const {Storage} = require("@google-cloud/storage")
    const storage = new Storage({
        projectId: 'imgur',
        keyFilename: '../imgur-backend/imgur-4ea0702af047.json'
    });    
    
    const bucketName = "image_bucket_here"
    await storage.bucket(bucketName).upload(filename, {
        // Destination file name
        destination: getRandomInt(9999).toString(),
        // gzip encoding
        gzip:true,
        metadata: {
            cacheControl: "public, max-age=31536000",
        },
    })

    console.log(filename, "uploaded to", bucketName)
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

// --------------------------- BROWSING FILE -------------------------------------
app.get('/display', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    let filenames = await display()
    return res.send(filenames)
})

async function display() {
    // Imports the Google Cloud client library
    const {Storage} = require('@google-cloud/storage');

    // Creates a client
    const storage = new Storage();

    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    const bucketName = 'image_bucket_here';

    // Lists files in the bucket
    const [files] = await storage.bucket(bucketName).getFiles();
    const filenames = []

    files.forEach(file => {
        filenames.push(file.name);
    });
    console.log(filenames);
    return filenames
}

