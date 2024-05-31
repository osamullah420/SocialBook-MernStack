import Post from "../models/postModel.js";
import cloudinary from "cloudinary";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const { image } = req.files || {};

    if (!description && !image) {
      return res
        .status(400)
        .send({ message: "Either description or image is required" });
    }

    let CloudinaryResponse;
    if (image) {
      CloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath);
      if (!CloudinaryResponse) {
        console.error(
          "Cloudinary error: ",
          CloudinaryResponse.error || "unknown cloudinary error!"
        );
        return res
          .status(500)
          .send({ message: "Error uploading image to Cloudinary" });
      }
    }

    const newPost = new Post({
      user: req.user._id, // Assuming req.user is set by an authentication middleware
      image: CloudinaryResponse
        ? {
            public_id: CloudinaryResponse.public_id,
            url: CloudinaryResponse.secure_url,
          }
        : null,
      description: description || null,
    });

    const savedPost = await newPost.save();
    res
      .status(201)
      .send({ success: true, savedPost, message: "You posted Successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error while uploading post!" });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user").sort({
      createdAt: -1,
    });

    res.status(200).send({
      success: true,
      posts,
      message: "Posts Fetched Successfully",
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get a post by ID
export const getPostById = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ user: userId }).populate("user");

    if (!posts) {
      return res.status(404).send({ message: "Posts not found" });
    }

    res
      .status(200)
      .send({ success: true, posts, message: "Posts fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
      post.totalLikes = post.likes.length;
      await post.save();
    }

    res.status(200).send(post);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Unlike a post
export const unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    const index = post.likes.indexOf(req.user._id);
    if (index > -1) {
      post.likes.splice(index, 1);
      post.totalLikes = post.likes.length;
      await post.save();
    }

    res.status(200).send(post);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete a post

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    // Check if the user is authorized to delete the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send({ message: "Unauthorized to delete this post" });
    }

    // If authorized, delete the post
    await Post.findByIdAndDelete(postId);

    res
      .status(200)
      .send({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Edit a post
export const editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { description } = req.body;
    const image = req.files ? req.files.image : null; // Handle case where req.files is null

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    // Check if the user is the owner of the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "Unauthorized" });
    }

    if (description) {
      post.description = description;
    }

    if (image) {
      // Delete the old image from Cloudinary
      if (post.image && post.image.public_id) {
        await cloudinary.uploader.destroy(post.image.public_id);
      }

      // Upload the new image to Cloudinary
      const CloudinaryResponse = await cloudinary.uploader.upload(
        image.tempFilePath
      );

      if (!CloudinaryResponse) {
        console.error(
          "Cloudinary error: ",
          CloudinaryResponse.error || "unknown cloudinary error!"
        );
      } else {
        post.image = {
          public_id: CloudinaryResponse.public_id,
          url: CloudinaryResponse.secure_url,
        };
      }
    }

    const updatedPost = await post.save();
    res.status(200).send({ updatedPost, message: "Post updated successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get a single post by ID
export const getSinglePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate("user");

    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    res
      .status(200)
      .send({ success: true, post, message: "Post fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
