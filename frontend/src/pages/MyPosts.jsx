import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyPosts = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const userId = auth?.user?._id;
  const [posts, setPosts] = useState([]);
  const [fetchError, setFetchError] = useState(null); // State to handle fetch errors
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/posts/getposts/${userId}`
        );
        if (response.data.success) {
          setPosts(response.data.posts);
          setLoading(false); // Set loading to false once posts are fetched
          setFetchError(null); // Clear any previous fetch errors
        } else {
          setFetchError(response.data.message);
          setLoading(false); // Set loading to false on error
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setFetchError("Failed to fetch posts. Please try again later.");
        setLoading(false); // Set loading to false on error
      }
    };

    if (userId) {
      fetchPosts();
    }
  }, [userId]); // useEffect will trigger whenever userId changes

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) {
      return; // Do nothing if user cancels deletion
    }

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/posts/delete/${postId}`
      );
      if (response.data.success) {
        setPosts(posts.filter((post) => post._id !== postId)); // Remove deleted post from state
        document.getElementById("my_modal_11").close();
        navigate("/"); // Example navigation after deletion
        toast.success("Post Deleted Successfully!", {
          position: "top-center",
        });
      } else {
        console.error("Failed to delete post:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <dialog id="my_modal_11" className="modal">
      <div className="modal-box bg-white p-6 rounded-lg shadow-md">
        <div className="modal-action flex flex-col items-start justify-center mt-2 mb-2">
          <h2 className="text-3xl font-bold mb-4">My Posts</h2>
          <hr className="border-t border-[#66666645] w-full my-4" />
        </div>
        <div className="flex flex-col items-center justify-center gap-6">
          {fetchError ? (
            <p className="text-red-500">{fetchError}</p>
          ) : loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-600 text-xl font-bold">
              No posts available.
            </p>
          ) : (
            posts.map((post) => (
              <Card key={post._id} post={post} onDelete={handleDeletePost} />
            ))
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            document.getElementById("my_modal_11").close();
          }}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </div>
    </dialog>
  );
};

export default MyPosts;
