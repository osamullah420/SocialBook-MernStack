import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditPost = ({ postId, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/posts/getpost/${postId}`
        );
        const { description, image } = response.data.post;
        setFormData({ description, image: null });
        setImagePreview(image ? image.url : null);
      } catch (error) {
        console.error("Error fetching post data", error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPostData = new FormData();
    updatedPostData.append("description", formData.description);
    if (formData.image) {
      updatedPostData.append("image", formData.image);
    }

    try {
      await axios.put(
        `http://localhost:8080/api/v1/posts/editpost/${postId}`,
        updatedPostData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      document.getElementById("my_modal_12").close();
      navigate("/");
      toast.success("Post Updated Successfully", {
        position: "top-center",
      });
      onClose();
    } catch (error) {
      console.error("Error updating post", error);
    }
  };

  const resetForm = () => {
    setFormData({
      description: "",
      image: null,
    });
    setImagePreview(null);
  };

  return (
    <dialog id="my_modal_12" className="modal" open>
      <div className="modal-box bg-white p-6 rounded-md shadow-md">
        <div className="modal-action flex flex-col items-start justify-center mt-2 mb-2">
          <h2 className="text-3xl font-bold mb-4">Edit Post</h2>
          <hr className="border-t border-gray-500 w-full my-4" />
          <form onSubmit={handleSubmit} className="space-y-4 form-control">
            <div>
              <label className="block text-lg font-medium py-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-lg font-medium py-2">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="file-input file-input-bordered w-full"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-full"
                  />
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Update Post
            </button>
            <button
              type="button"
              onClick={() => {
                document.getElementById("my_modal_12").close(); // Close modal on cancel
                resetForm(); // Reset form fields after closing
                onClose(); // Callback to handle additional actions on close
              }}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default EditPost;
