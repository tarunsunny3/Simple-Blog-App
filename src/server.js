import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import Articles from "./models/ArticleSchema";

mongoose
  .connect(
    "mongodb+srv://Tarun:tarun0508@cluster0-2qgfp.mongodb.net/blog-app?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then(() => console.log("MongoDb connected successfully"));
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/build")));
app.get("/api/articles/:name", (req, res) => {
  const articleName = req.params.name;
  Articles.findOne({ name: articleName }, (error, article) => {
    if (!error) {
      res.send(article);
    } else {
      console.log(error);
    }
  });
});

app.post("/api/articles/:name/upvote", (req, res) => {
  const articleName = req.params.name;

  Articles.findOneAndUpdate(
    { name: articleName },
    { $inc: { upvotes: 1 } },
    (err, found) => {
      if (err) {
        console.log(err);
      } else {
        found.save();
        res.status(200).send(found);
      }
    }
  );
});
app.post("/api/articles/:name/add-comment", (req, res) => {
  const { username, text } = req.body;
  const articleName = req.params.name;
  Articles.findOne({ name: articleName }, (err, foundArticle) => {
    if (err) {
      console.log(err);
    } else {
      foundArticle.comments.push({ username, text });
      foundArticle.save();
      res.send(foundArticle);
    }
  });
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => console.log("Server has started successfully"));
