import cloudinary from "../lib/cloudinary.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

export const getFeedPosts = async (req, res) => {
  try {
    // Look for posts where author is in ($in) the list of the logged in users' user.connections
    const posts = await Post.find({
      author: { $in: req.user.connections },
    })
      // populate() replaces referenced IDs with the actual documents they point to.
      //Instead of just returning the author ID, it replaces it with: name, username, profilePicture, headline
      .populate("author", "name username profilePicture headline")
      // For each comment replace user ID with: name, profilePicture
      .populate("comments.user", "name profilePicture")
      // -1 means descending order, newest in the list show first
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getFeedPosts controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    let newPost;

    if (image) {
      const imgResult = await cloudinary.uploader.upload(image);
      newPost = new Post({
        author: req.user._id,
        content,
        image: imgResult.secure_url,
      });
    } else {
      newPost = new Post({
        author: req.user._id,
        content,
      });
    }

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    // id vs _id: id is a string, _id is an ObjectId object
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // check if the current user is the author of the post
    if (post.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    // delete image from cloudinary as well
    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0] // takes the image url from cloudinary and formats to only contain the id of the image
      );
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletePost controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture username headline");

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getPostById controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { user: req.user._id.content } },
      },
      { new: true }
    ).populate("author", "name email username headline profilePicture");

    // create notification if comment owner is not the post owner
    if (post.author.toString() !== req.user._id.toString()) {
      const newNotification = new Notification({
        recipient: post.author,
        type: "comment",
        relatedUser: req.user._id,
        relatedPost: postId,
      });

      await newNotification.save();

      // Send notification email
      try {
        const postUrl = process.env.CLIENT_URL + "/post" + postId;
        await sendCommentNotifcationEmail(
          post.author.email,
          post.author.name,
          req.user.name,
          postUrl,
          content
        );
      } catch (error) {
        console.error("Error in sending comment notification email: ", error);
        res.status(500).json({ message: "Server error" });
      }
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in createComment controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const userId = req.user._id;

    if (post.likes.includes(userId)) {
      // unlike post: take away user from post.like array
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // like the post: add it to the post.likes array
      post.likes.push(userId);

      // create notification if the post owner is not the user who liked
      if (post.author.toString() !== userId.toString()) {
        const newNotification = new Notification({
          recipient: post.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId,
        });

        await newNotification.save();
      }
    }
    await post.save();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error in likePost controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};
