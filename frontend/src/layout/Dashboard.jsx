import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useAuth } from "../context/AuthProvider";
import { BiImages } from "react-icons/bi";
import AddPost from "../components/AddPost";
import { ToastContainer } from "react-toastify"; // Import toast
import Spinner from "../components/Spinner";
import PostCard from "../components/PostCard";
import Footer from "../components/Footer";

const Dashboard = () => {
  const [auth] = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [auth]); // useEffect will run once on component mount

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/posts/getallposts"
      );
      setPosts(response.data.posts);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="home w-full px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40  lg:rounded-lg h-screen overflow-hidden">
      <Header />

      <div className="w-full flex flex-col overflow-y-auto overflow-x-hidden hover:overflow-y-scroll gap-2 md:gap-4 pt-5 pb-10 h-full">
        <ToastContainer />
        <div className="px-4 w-full gap-6 flex flex-col mt-20 rounded-lg">
          <form className="bg-gray-200 px-6 rounded-lg">
            <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
              {auth?.user?.image?.url && (
                <img
                  src={auth?.user?.image?.url}
                  alt="Profile"
                  className="rounded-full w-16 h-16 object-cover"
                />
              )}
              <input
                type="text"
                onClick={() =>
                  document.getElementById("my_modal_7").showModal()
                }
                className="w-full rounded-full py-5 px-4"
                placeholder="What's on your mind...."
                name="description"
              />
            </div>
            <div className="flex items-center justify-between py-4">
              <label
                htmlFor="ImgUpload"
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
              >
                <input
                  type="file"
                  id="ImgUpload"
                  className="hidden"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("my_modal_7").showModal();
                  }}
                />
                <BiImages />
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("my_modal_7").showModal();
                  }}
                >
                  Image
                </span>
              </label>
            </div>
          </form>
        </div>
        <div className="pr-4 pl-4 w-full gap-2 flex flex-col mt-4 rounded-lg">
          {loading ? (
            <Spinner />
          ) : posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </div>
      <AddPost />
    </div>
  );
};

export default Dashboard;
