const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");

const crypto = require("crypto");

require("dotenv").config();

const app = express();

var bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use(cors());

app.use(methodOverride("_method"));

const uri = "mongodb+srv://rahul:xz7bpTm8ILa2Vwdb@cluster0.zkzfs.mongodb.net/trial3?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;

let gfs;

connection.once("open", () => {
 gfs = Grid(connection.db, mongoose.mongo);
 gfs.collection("uploads");

 console.log("mongidb sucess");
});

const storage = new GridFsStorage({
 url: uri,
 file: (req, file) => {
  return new Promise((resolve, reject) => {
   crypto.randomBytes(16, (err, buf) => {
    if (err) {
     return reject(err);
    }
    const filename = file.originalname;
    const fileInfo = {
     filename: filename,
     bucketName: "uploads",
    };
    resolve(fileInfo);
   });
  });
 },
});
const upload = multer({ storage });

const usersRouter = require("./routes/users");
const examsRouter = require("./routes/exam");

app.post("/upload", upload.single("file"), (req, res) => {
 res.json({ file: req.file });
});

app.post("/uploadMultiple", upload.array("file", 90), (req, res) => {
 res.send("sucessfully submitted");
});

app.get("/files", (req, res) => {
 gfs.files.find().toArray((err, files) => {
  return res.json(files);
 });
});

app.get("/images/:filename", (req, res) => {
 gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
  if (!err) {
   const readstream = gfs.createReadStream(file.filename);
   readstream.pipe(res);
  }
 });

 // gfs.files.find((err,file)=>{
 //   console.log(file);

 //   for(let i=file.length-1;i>=0;i--){
 //     if(file[i].filename===req.params.filename){
 //       const readstream=gfs.createReadStream(file[i].filename);
 //       readstream.pipe(res);
 //       break;
 //     }
 //   }

 // })
});

app.post("/images/delete", (req, res) => {
 gfs.files.deleteOne({ filename: req.body.filename }, (err) => {
  if (!err) res.send(req.body.filename);
 });
});

app.use("/user", usersRouter);

app.use("/exam", examsRouter);

if (process.env.NODE_ENV === "production") {
 app.use(express.static("front/build"));

 app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "front", "build", "index.html"));
 });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
 console.log(`server is running on port `);
});
