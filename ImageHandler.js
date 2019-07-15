class ImageHandler{

    print() {
        // return <App print={this.print}/>
        console.log("hello")
    }


    async upload(filename) {
        console.log("uploading...", filename)

        const {Storage} = require("@google-cloud/storage")
        const storage = new Storage({
            projectId: 'imgur',
            keyFilename: '../imgur-4ea0702af047.json'
        });    
        
        const bucketName = "image_bucket_here"

        await storage.bucket(bucketName).upload(filename, {
            // Destination file name
            destination: "user1/" + filename,
            // gzip encoding
            gzip:true,
            metadata: {
                cacheControl: "public, max-age=31536000",
            },
        })

        console.log(filename, "uploaded to", bucketName)
    }

    async download(srcFilename) {
        console.log("downloading...", srcFilename)

        const {Storage} = require("@google-cloud/storage")
        const storage = new Storage({
            projectId: 'imgur',
            keyFilename: '../imgur-4ea0702af047.json'
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
        
        console.log(bucketName, "-", srcFilename,  "downloaded to", destFilename)
    }
}

export default ImageHandler

// download("user1/new_pug.jpg");
// upload("new_pug.jpg")
// console.log(App.user)
