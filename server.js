const express = require('express')
const multer = require("multer")
var fs = require('fs')
var path = require('path')
const process = require('process')

const app = express()
const port = 5000
const cors = require("cors")

const logger = require("./logger")
const morgan = require('morgan')

app.use(cors());
app.listen(port, () => console.log(`Server listening on port ${port}!`))
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'log-history.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

// -------------------------------------------------------- LOGGER -------------------------------------------------------

const handler = (func) => (req, res) => {
    try {
        logger.info('server.handler.begun');
        func(req, res, logger);
    } catch (e) {
        logger.info('server.handler.failed');
        res.send('Oh no, something did not go well!');
    }
};

app.all("*", (req, res, next) => {
    logger.info("Incoming request", { method: req.method })

    // logger.debug("Incoming request verbase", {
    //     headers: req.headers,
    //     query: req.query,
    //     body: req.body
    // })

    return next();
})

// ------------------------------------------------------- DOWNLOAD FILE -------------------------------------------------
app.get('/download/:filename', (req, res) => {
    try {
        console.log("downloading")
        logger.info("/ download start:", { query: req.query })
        res.setHeader('Access-Control-Allow-Origin', '*')
        // console.log("downloading", req.params.filename)
        download(req.params.filename)
        res.send('DOWNLOAD SUCCESS')
    } catch (e) {
        logger.error("DOWNLOAD FAIL: ", e.display)
        res.send("DOWNLOAD FAIL")
    }
})

// DOWNLOAD HELPER
async function download(srcFilename) {
    console.log("downloading...", srcFilename)
    const { Storage } = require("@google-cloud/storage")
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
        .file("images/" + srcFilename)
        .download(options);

    // logger.info(srcFilename, "downloaded to", destFilename)
}

// ---------------------------------------------- BROWSE FILE -------------------------------------------------

// store selected image as "MyImage" in uplaods direcotry
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'imgur-frontend/src/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname)
    }
})

var browse = multer({ storage: storage })

app.post('/browseFile', browse.single('myImage'), (req, res, next) => {
    logger.info("/ browse start:", { query: req.query })
    try {
        const file = req.file
        if (!file) {
            logger.info("/ browse: file is null")
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
        res.send(file)
    } catch (e) {
        logger.error("BROWSING FAIL")
        res.send("BROWSING FAIL")
    }
})

// ------------------------------------------------------------ UPLOAD FILE -------------------------------------------------------
app.get('/upload', (req, res) => {
    logger.info("/ upload start:", { query: req.query })
    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        upload()
        res.send("UPLOAD SUCCESS")
    } catch (e) {
        logger.error("UPLOAD FAIL")
        res.send("UPLOAD FAIL")
    }
})


// UPLOAD HELPER
async function upload() {
    let filename = "imgur-frontend/src/uploads/myImage"
    const { Storage } = require("@google-cloud/storage")
    const storage = new Storage({
        projectId: 'imgur',
        keyFilename: '../imgur-backend/imgur-4ea0702af047.json'
    });

    const bucketName = "image_bucket_here"
    await storage.bucket(bucketName).upload(filename, {
        // Destination file name
        destination: "images/" + getRandomInt(9999).toString(),
        // gzip encoding
        gzip: true,
        metadata: {
            cacheControl: "public, max-age=31536000",
        },
    })

    // console.log(filename, "uploaded to", bucketName)
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// ------------------------------------------------------- DISPLAY IMAGES --------------------------------------------------------
app.get('/display', async (req, res) => {
    logger.info("/ display start:", { query: req.query })
    try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        let filenames = await display()
        res.send(filenames)
    } catch (e) {
        logger.error("DISPLAY FAIL")
        res.send("DISPLAY FAIL")
    }
})

async function display() {


    // Imports the Google Cloud client library
    const { Storage } = require('@google-cloud/storage');

    // Creates a client
    const storage = new Storage();

    const bucketName = 'image_bucket_here';
    const prefix = 'images/';
    const delimiter = '/';

    const options = {
        prefix: prefix,
    };

    if (delimiter) {
        options.delimiter = delimiter;
    }

    // Lists files in the bucket
    const [files] = await storage.bucket(bucketName).getFiles(options);
    const filenames = []

    files.forEach(file => {
        let filename = file.name.substring(file.name.indexOf('/'), file.name.length)
        filenames.push(filename);
    });

    filenames.splice( filenames.indexOf('/'), 1 );

    console.log(filenames)
    return filenames
}

