//for express
const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const app = express();

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://yang:OIuTsHZzB0Dp4x9N@cluster0-swfeo.mongodb.net/mean?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

mongoose
  .connect(
    "MONGODBCONNECTIONURL"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));
app.use("/images", express.static(path.join("backend/images")));
app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Orgini, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, PUT, DELETE, OPTIONS")
    next();
})
app.use("/api/post",postsRoutes);
app.use("/api/user",userRoutes);
module.exports = app;
