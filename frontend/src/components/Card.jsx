import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BsPencil, BsTrash } from "react-icons/bs";
import EditPost from "../pages/EditPost"; // Import the EditPost component

dayjs.extend(relativeTime);

const Card = ({ post, onDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPostId, setEditPostId] = useState(null);

  if (!post) {
    return null;
  }

  const timeSince = dayjs(post.createdAt).fromNow();

  const handleEditClick = () => {
    setEditPostId(post._id);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    onDelete(post._id);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditPostId(null);
  };

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <div className="flex  flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex  md:flex-row justify-start items-center gap-4">
          <div>
            {post?.user?.image?.url && (
              <img
                src={post?.user?.image?.url}
                alt="Profile"
                className="rounded-full w-16 h-16"
              />
            )}
          </div>
          <div>
            <p className="font-semibold">{post?.user?.name}</p>
            <p className="">Posted {timeSince} ago</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleEditClick}
            className="flex items-center px-4 py-2 btn text-white bg-[#0000ff]"
          >
            <BsPencil className="mr-2" /> Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="flex items-center px-4 py-2 btn text-white bg-[#FF0000]"
          >
            <BsTrash className="mr-2" /> Delete
          </button>
        </div>
      </div>
      <hr className="border-[#66666645] mt-4 py-4" />
      <p className="pb-4 font-semibold">{post.description}</p>
      {post.image?.url && (
        <img
          src={post.image?.url}
          alt="Post"
          className="w-full h-48 object-cover mb-4 rounded-lg"
        />
      )}
      <p className="py-2 font-bold">{post.totalLikes} Likes</p>

      {isEditModalOpen && (
        <EditPost postId={editPostId} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Card;
