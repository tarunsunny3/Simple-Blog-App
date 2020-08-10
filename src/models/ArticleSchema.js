import mongoose from "mongoose";
const Schema = mongoose.Schema;
var articleSchema = new Schema({
  name: String,
  upvotes: Number,
  comments: [],
});
module.exports = mongoose.model("Article", articleSchema);
