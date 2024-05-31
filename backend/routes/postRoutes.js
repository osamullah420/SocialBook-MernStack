import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  likePost,
  unlikePost,
  deletePost,
  editPost,
  getSinglePostById,
} from "../controllers/postController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to create a new post
router.post("/createpost", requireSignIn, createPost);

// Route to get all posts
router.get("/getallposts", getPosts);

// Route to get a post by ID
router.get("/getposts/:id", getPostById);

// Route to get a single post by ID
router.get("/getpost/:id", getSinglePostById);

// Route to like a post
router.put("/:id/like", requireSignIn, likePost);

// Route to unlike a post
router.put("/:id/unlike", requireSignIn, unlikePost);

// Route to delete a post
router.delete("/delete/:id", requireSignIn, deletePost);

router.put("/editpost/:id", requireSignIn, editPost);

export default router;
