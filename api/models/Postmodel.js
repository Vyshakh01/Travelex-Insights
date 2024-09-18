const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ReplySchema = new Schema({
  reply: String,
  repliedby: String,
});

const CommentSchema = new Schema({
  comment: String,
  author: String,
  replies: [ReplySchema],
});

const PostSchema = new Schema(
  {
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [CommentSchema],
    likedBy: [String],
  },
  {
    timestamps: true,
  }
);

const PostModel = model("Postmodel", PostSchema);
module.exports = PostModel;
