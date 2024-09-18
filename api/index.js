const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const Postmodel = require("./models/Postmodel");

const secret = "kjndkijbicjhbjanskjansjan";
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose
  .connect(
    "mongodb+srv://vyshakhrajeevan:EtLwcaqCeu24YYew@cluster0.irvgfrw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("====================================");
    console.log("Listening");
    console.log("====================================");
    // app.listen(5000);
  })
  .catch((e) => {
    console.log("error occured while connecting mongoose : " + e);
  });

/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/
app.post("/Register", async (req, res) => {
  const { username, password } = req.body;
  dbuser = await User.findOne({ username: username });
  let hashed_password;
  if (!dbuser) {
    if (password.length > 4) {
      try {
        const salt = await bcrypt.genSalt();
        hashed_password = await bcrypt.hash(password, salt);
      } catch (e) {
        console.log("error occured while encrypting:" + e);
      }

      const userDoc = User.create({ username, password: hashed_password })
        .then(() => {
          res.json({ success: true, message: "Registration Successful" });
        })
        .catch((e) => {
          res.status(400).json(e);
          console.log("err occured while creating user : " + e);
        });
    } else {
      res.json({ success: false, message: "Password is too short" });
    }
  } else {
    res.json({ success: false, message: "Username already exists" });
  }
});

/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/

app.post("/Login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });

    if (!userDoc) {
      return res.json({ success: false, message: "User not found" });
    }

    const passOK = await bcrypt.compare(password, userDoc.password);
    if (passOK) {
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) {
          console.log("error occured while signing jwt", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.cookie("token", token, { httpOnly: true, secure: true }).json({
          id: userDoc._id,
          username,
          success: true,
          message: "Login Successful",
        });
      });

      console.log("login success");
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect Password" });
    }
  } catch (e) {
    console.log("error comparing password ", e);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      console.log("error while verifying jwt", err);
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.json(info);
  });
});

/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/

app.post("/createpost", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, path + "." + ext);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      console.log("error while verifying jwt", err);
      // return res.status(401).json({ error: 'Unauthorized' });
    }
    const { title, summary, content } = req.body;
    const postDoc = await Postmodel.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

app.get("/createpost", async (req, res) => {
  res.json(
    await Postmodel.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(10)
  );
});

/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/

app.get("/SinglePost/:id", async (req, res) => {
  const { id } = req.params;

  postDoc = await Postmodel.findById(id).populate("author", ["username"]);
  postDoc2 = await Postmodel.findById(id)
    .populate("author", ["username"])
    .populate("comments");

  // console.log(postDoc2.comments);

  res.json(postDoc);
});

/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/

app.put("/EditPost", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, path + "." + ext);
  }

  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      console.log("error while verifying jwt", err);
      // return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id, title, summary, content } = req.body;
    const postDoc = await Postmodel.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      res.status(400).json("you are not the author");
    }
    try {
      await postDoc.updateOne({
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      });
    } catch (e) {
      console.log("error happened" + e);
    }

    res.json(postDoc);
  });
});

/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/

app.post("/Comment", async (req, res) => {
  //  const {commentDoc}=req.body;

  const { postId, authorname, commentText } = req.body;

  console.log(postId, authorname, commentText);
  const Commentpost = await Postmodel.findById(postId);
  console.log(Commentpost.title, Commentpost.comments);
  console.log("author:", authorname);
  newComment = {
    author: authorname,
    comment: commentText,
  };
  Commentpost.comments.push(newComment);
  await Commentpost.save();
  //res.json(comment);
  console.log(Commentpost.comments);
});
/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/

app.post("/Like", async (req, res) => {
  try {
    const { postId, Likedby } = req.body;

    // Fetch the post by ID
    const LikedPost = await Postmodel.findById(postId);

    // Check if the post exists
    if (!LikedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    const userIndex = LikedPost.likedBy.indexOf(Likedby);

    if (userIndex === -1) {
      // User has not liked the post yet, so add them to the likedBy array
      LikedPost.likedBy.push(Likedby);
      await LikedPost.save();
      console.log("User liked the post", LikedPost.likedBy);
      return res.status(200).json({ message: "Liked post successfully" });
    } else {
      // User has already liked the post, so remove them from the likedBy array
      LikedPost.likedBy.splice(userIndex, 1);
      await LikedPost.save();
      console.log("User unliked the post", LikedPost.likedBy);
      return res.status(200).json({ message: "Unliked post successfully" });
    }
  } catch (error) {
    console.error("Error handling like request:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while handling the like request" });
  }
});

/*_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________
_______________________________________________________________________________________________________________________________________*/

app.post("/CommentReply", async (req, res) => {
  try {
    const { postId, commentId, authorname, replyText } = req.body;

    // Find the post by its ID
    const post = await Postmodel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Find the comment by its ID within the post
    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Create a new reply object
    const newReply = {
      reply: replyText,
      repliedby: authorname,
    };

    // Add the new reply to the comment's replies array
    comment.replies.push(newReply);

    // Save the updated post
    await post.save();
    console.log(comment);
    // Return the updated comments array as part of the response
    res.json({ updatedComments: post.comments });
  } catch (error) {
    console.error("Error handling reply request:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
});

app.listen(5000);
