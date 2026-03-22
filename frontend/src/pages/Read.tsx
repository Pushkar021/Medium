"use client";

import { useState, useEffect } from "react";
import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";
import { Appbar } from "../Components/Appbar";
import axios from "axios";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown"

const backendUrl = import.meta.env.VITE_DATABASE_URL;

export const Read = () => {
  const { id } = useParams<{ id: string }>();
  const blog = useBlog(id || "");
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  interface Blog {
    id: string;
    autherName?: string;
    title?: string;
    content?: string;
    imagelink?: string;
    published?: string;
    createdAt?: string;
  }

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${backendUrl}/api/v1/blog/check/savedblog/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data === true) setLiked(true);
      })
      .catch(() => {});
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

  const blogPost = blog.getblog[0] as Blog;

  const handleLike = async () => {
    if (loading || liked) return;
    setLoading(true);
    try {
      await axios.get(`${backendUrl}/api/v1/blog/savedblog/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setLiked(true);
    } catch (error) {
      console.error("Error liking blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const components: Components = {
    code({ node, children, ...props }) {
      const isInline =
        !node?.position || node.position.start.line === node.position.end.line;

      return isInline ? (
        <code
          style={{
            backgroundColor: "#0d0d0d",
            color: "#00ffff",
            padding: "2px 6px",
            borderRadius: "6px",
          }}
          {...props}
        >
          {children}
        </code>
      ) : (
        <pre
          style={{
            backgroundColor: "#0d0d0d",
            color: "#00ffff",
            padding: "12px",
            borderRadius: "10px",
            overflowX: "auto",
          }}
        >
          <code {...props}>{children}</code>
        </pre>
      );
    },
  };

  return (
    <div className="bg-slate-900 min-h-screen">
      <Appbar />

      <motion.main
        className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
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
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                  {blogPost.title}
                </h1>

                <button
                  onClick={handleLike}
                  disabled={loading || liked}
                  className="focus:outline-none transition-transform transform hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={liked ? "red" : "white"}
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

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium mr-2">
                    {blogPost.autherName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{blogPost.autherName}</span>
                </div>

                <time>
                  {new Date(blogPost.createdAt || "").toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long", day: "numeric" },
                  )}
                </time>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mb-6"></div>

              <div className="prose prose-lg max-w-none dark:prose-invert">
                <ReactMarkdown components={components}>
                  {blogPost.content || ""}
                </ReactMarkdown>
              </div>
            </div>
          </article>

          <div className="mt-8 text-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center w-full px-4 py-2
              bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold
              rounded-2xl transition duration-300 hover:from-pink-500 hover:to-purple-500"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      </motion.main>
    </div>
  );
};
