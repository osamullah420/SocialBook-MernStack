import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiOutlineLike } from "react-icons/ai";
import { AiTwotoneDislike } from "react-icons/ai";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";

dayjs.extend(relativeTime);

const PostCard = ({ post }) => {
  const [auth] = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);

  useEffect(() => {
    setIsLiked(post.likes.includes(auth?.user._id));
  }, [post.likes, auth?.user?._id]);

  const handleLike = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/posts/${post._id}/like`,
        {}
      );
      setLikesCount(response.data.totalLikes);
      setIsLiked(true);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/posts/${post._id}/unlike`,
        {}
      );
      setLikesCount(response.data.totalLikes);
      setIsLiked(false);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const timeSince = dayjs(post.createdAt).fromNow();
  return (
    <div className="card w-full py-4 bg-gray-200 shadow-xl p-4 mt-6 rounded-lg">
      <div className="flex flex-row justify-start items-center gap-4 border-b border-[#66666645] py-4">
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
          <p className="font-semibold">{post.user.name}</p>
          <p className="">Posted {timeSince}...</p>
        </div>
      </div>
      <div className="card-body px-0 py-6">
        <p className="text-xl font-semibold">{post?.description}</p>
      </div>
      <div>
        <figure className="mt-4">
          {post?.image?.url && (
            <img
              src={post?.image?.url}
              alt="Post"
              className="w-full h-[100vh] rounded-lg"
            />
          )}
        </figure>
      </div>
      <span className=" mt-6 text-xl font-bold">{likesCount} Likes</span>
      <hr className="border-[#66666645] mt-6" />
      <div className="card-body p-4 flex flex-row items-center">
        <h2 className="card-title">
          {isLiked ? (
            <AiTwotoneDislike
              className="w-10 h-10 cursor-pointer"
              onClick={handleUnlike}
            />
          ) : (
            <AiOutlineLike
              className="w-10 h-10 cursor-pointer"
              onClick={handleLike}
            />
          )}
        </h2>
        <a
          className="text-2xl cursor-pointer"
          onClick={isLiked ? handleUnlike : handleLike}
        >
          {isLiked ? "Unlike" : "Like"}
        </a>
      </div>
    </div>
  );
};

export default PostCard;
