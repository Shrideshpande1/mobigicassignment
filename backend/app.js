require("dotenv").config()
// const { S3Client } = require('@aws-sdk/client-s3')
const express = require('express')
const cors=require("cors")
const app = express();

app.listen(8080);



const aws = require('aws-sdk') 
const multer = require('multer')
const multerS3 = require('multer-s3');

app.use(cors({
    origin:"*"
}))
aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,

});
const BUCKET = process.env.BUCKET
const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        bucket: BUCKET,
        key: function (req, file, cb) {
            console.log(file);
            cb(null,Date.now()+file.originalname)
        }
    })
})

app.post('/upload', upload.single('file'), async function (req, res, next) {
console.log(req.file)
    res.send('Successfully uploaded ' + req.file.location + ' location!')

})

app.get("/list", async (req, res) => {

    let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
    let x = r.Contents.map(item => item.Key);
    res.send(x)
})


app.get("/download/:filename", async (req, res) => {
    const filename = req.params.filename
    let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
    console.log(x)
    res.send(x.Body)
})

app.delete("/delete/:filename", async (req, res) => {
    const filename = req.params.filename
    await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
    res.send("File Deleted Successfully")

})

app.get("/downloafile/:filename", async (req, res) => {
    const filename = req.params.filename
    let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
    console.log(x)
    res.send(x)
})