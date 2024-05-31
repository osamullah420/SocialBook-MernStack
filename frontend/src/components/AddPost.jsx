// src/components/AddPost.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddPost = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const formData = new FormData();
    if (data.description.trim()) {
      formData.append("description", data.description.trim());
    }
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/posts/createpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        navigate("/");
        toast.success("Post Uploaded Successfully!", {
          position: "bottom-right",
        });
        reset();
        setImagePreview(null);
        document.getElementById("my_modal_7").close(); // Close modal on success
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog id="my_modal_7" className="modal">
      <div className="modal-box bg-white p-6 rounded-lg shadow-md">
        <div className="modal-action flex flex-col items-start justify-center mt-2 mb-2">
          <h2 className="text-3xl font-bold mb-4">Upload Post</h2>
          <hr className="border-t border-gray-500 w-full my-4" />
          <form
            className="space-y-4 form-control"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <input
                type="text"
                className="w-full rounded-full py-5 px-4"
                placeholder="What's on your mind...."
                {...register("description")}
              />
              {errors.description && (
                <span className="text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-lg font-medium py-2">Image</label>
              <input
                type="file"
                name="image"
                className="file-input file-input-bordered w-full"
                {...register("image")}
                onChange={handleImageChange}
              />
              {errors.image && (
                <span className="text-red-500">{errors.image.message}</span>
              )}
            </div>
            {imagePreview && (
              <div className="w-full flex justify-center mt-4">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
            <button
              type="button"
              onClick={() => {
                document.getElementById("my_modal_7").close(); // Close modal on cancel
                reset(); // Reset form fields after closing
                setImagePreview(null);
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

export default AddPost;
