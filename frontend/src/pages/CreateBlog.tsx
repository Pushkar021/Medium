import React, { useState } from "react";
import { Appbar } from "../Components/Appbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const backendUrl = import.meta.env.VITE_DATABASE_URL;
export const CreateBlog: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagelink, setImageLink] = useState("");
  const navigate = useNavigate();
  const handleSubmit = () => {
    
   
    if(title==""||content==""){
alert("Title or Content can not be empty")
    }
    else{
      axios.post(
         `${backendUrl}/api/v1/blog/test`,
        { title, content, imagelink },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      ); 

    navigate("/blogs");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Appbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r bg-black">
          Create New Blog
        </h1>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          {/* Title */}
          <div className="flex flex-col">
            <label className="text-gray-700 mb-2 font-semibold">Title</label>
            <input
              type="text"
              className="bg-gray-100 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col">
            <label className="text-gray-700 mb-2 font-semibold">Content</label>
            <textarea
              className="bg-gray-100 border border-gray-300 rounded-xl p-3 h-64 resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              placeholder="Write your blog..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Image */}
          <div className="flex flex-col">
            <label className="text-gray-700 mb-2 font-semibold">
              Image URL
            </label>
            <input
              type="text"
              className="bg-gray-100 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              placeholder="Enter image link (optional)"
              value={imagelink}
              onChange={(e) => setImageLink(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="
    w-full
    bg-gradient-to-r from-purple-500 to-pink-500
    text-white
    font-bold
    py-3
    rounded-2xl
    transition-colors
    duration-300
    ease-in-out
    hover:from-pink-500
    hover:to-purple-500
  "
          >
            Publish Blog
          </button>
         
        </div>
      </div>
    </div>
  );
};
