var CronJob = require('cron').CronJob;
new CronJob('* * * * * *', upload, null, true);

async function upload() {
    let filename = "log-history.log"
    let now = new Date
    let timeDate = now.getHours().toString() + "." + now.getMinutes().toString() + "." + now.getSeconds().toString() + ", " +
        now.getDate().toString() + "." + now.getMonth().toString() + "." + now.getFullYear().toString()

    const { Storage } = require("@google-cloud/storage")
    const storage = new Storage({
        projectId: 'imgur',
        keyFilename: '../imgur-backend/imgur-4ea0702af047.json'
    });

    const bucketName = "image_bucket_here"
    await storage.bucket(bucketName).upload(filename, {
        // Destination file name
        destination: "logs/log: " + timeDate,
        // gzip encoding
        gzip: true,
        metadata: {
            cacheControl: "public, max-age=31536000",
        },
    })
    console.log("log uploaded")
}

// new CronJob('* * * * * *', upload(), null, true)
// upload()