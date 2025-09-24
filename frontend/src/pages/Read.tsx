import React, { useState, useEffect } from "react";
import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";
import { Appbar } from "../Components/Appbar";
import axios from "axios";
const backendUrl = import.meta.env.VITE_DATABASE_URL;

export const Read = () => {
  const { id } = useParams<{ id: string }>();
  const blog = useBlog(id || "");
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if already liked
  useEffect(() => {
    if (!id) return;
    axios
      .get(
        `${backendUrl}/api/v1/blog/check/savedblog/${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.data === true) {
          setLiked(true);
        }
      })
      .catch();
  }, [id]);

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Invalid blog ID</div>
      </div>
    );
  }

  if (!blog || blog.getblog.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  const blogPost = blog.getblog[0];

  const handleLike = async () => {
    if (loading || liked) return; // prevent spam & double-like
    setLoading(true);

    try {
      setLiked(true);
      await axios.get(
        `${backendUrl}/api/v1/blog/savedblog/${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setLiked(true);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Appbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {blogPost.imagelink && (
              <div className="w-full h-64 sm:h-80 overflow-hidden">
                <img
                  src={blogPost.imagelink}
                  alt={blogPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {blogPost.title}
                </h1>

                {/* Like Button */}
                <button
                  onClick={handleLike}
                  disabled={loading || liked}
                  className="focus:outline-none transition-transform transform hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={liked ? "red" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke={liked ? "red" : "currentColor"}
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.435 6.343a5.5 5.5 0 00-7.778 0L12 8l-1.657-1.657a5.5 5.5 0 00-7.778 
                      7.778l1.657 1.657L12 21.414l7.778-7.778 1.657-1.657a5.5 5.5 0 000-7.778z"
                    />
                  </svg>
                </button>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium mr-2">
                    {blogPost.autherName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{blogPost.autherName}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 
                      2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 
                      0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 
                      000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <time>
                    {new Date(blogPost.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                {blogPost.published && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Published
                  </span>
                )}
              </div>

              <div className="border-t border-gray-200 mb-6"></div>

              <div className="prose prose-lg max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {blogPost.content}
                </div>
              </div>
            </div>
          </article>

          <div className="mt-8 text-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 w-full
                bg-gradient-to-r from-purple-500 to-pink-500
                text-white font-bold rounded-2xl transition-colors duration-300
                hover:from-pink-500 hover:to-purple-500"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
