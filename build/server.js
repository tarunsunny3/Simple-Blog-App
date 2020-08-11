"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _ArticleSchema = require("./models/ArticleSchema");

var _ArticleSchema2 = _interopRequireDefault(_ArticleSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.connect("mongodb+srv://Tarun:tarun0508@cluster0-2qgfp.mongodb.net/blog-app?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(function () {
  return console.log("MongoDb connected successfully");
});
var app = (0, _express2.default)();
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use(_express2.default.static(_path2.default.join(__dirname, "../../my-blog/build")));
app.get("/api/articles/:name", function (req, res) {
  var articleName = req.params.name;
  _ArticleSchema2.default.findOne({ name: articleName }, function (error, article) {
    if (!error) {
      res.send(article);
    } else {
      console.log(error);
    }
  });
});

app.post("/api/articles/:name/upvote", function (req, res) {
  var articleName = req.params.name;

  _ArticleSchema2.default.findOneAndUpdate({ name: articleName }, { $inc: { upvotes: 1 } }, function (err, found) {
    if (err) {
      console.log(err);
    } else {
      found.save();
      console.log(found);
      res.status(200).send(found);
    }
  });
});
app.post("/api/articles/:name/add-comment", function (req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      text = _req$body.text;

  var articleName = req.params.name;
  _ArticleSchema2.default.findOne({ name: articleName }, function (err, foundArticle) {
    if (err) {
      console.log(err);
    } else {
      foundArticle.comments.push({ username: username, text: text });
      foundArticle.save();
      res.send(foundArticle);
    }
  });
});
app.get("*", function (req, res) {
  res.sendFile(_path2.default.join(__dirname, "../../my-blog/build/index.html"));
});
var port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function () {
  return console.log("Server has started successfully");
});
//# sourceMappingURL=server.js.map