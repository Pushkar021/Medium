import React, { useEffect } from "react";
import { BlogComponent } from "../Components/UserBlogComponent";
import { Appbar } from "../Components/Appbar";
import { useUserBlog } from "../hooks/index";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export const User = () => {
  const { loading, blogs } = useUserBlog();

  // Show toast when loading, dismiss when done
  useEffect(() => {
    if (loading) {
      toast.loading("Fetching Blogs...", {
        id: "auth",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      toast.dismiss("auth");
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="h-screen">
        <Appbar />
        <Toaster />
        <div className="flex justify-center items-center mt-70">
          Loading blogs...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      <Toaster />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r bg-black">
            {blogs && blogs.length > 0
              ? `Blogs Written by ${blogs[0].autherName}`
              : "No Blogs Yet"}
          </h1>

          
            <Link to="/xyz">
              <span className="bg-slate-900 text-white w-25 h-8 flex items-center justify-center p-2 rounded-2xl hover:scale-105 hover:bg-slate-700 transition-all duration-300 mt-2 ml-2">
                Saved_Blogs
              </span>
            </Link>
          
        </div>

        <div className="flex flex-col pt-5 items-center">
          <div className="w-full max-w-2xl">
            {blogs && blogs.length > 0 ? (
              blogs.map((x, index) => (
                <BlogComponent
                  key={x.id || index}
                  id={x.id || index}
                  name={x.autherName || "Unknown"}
                  title={x.title || "Untitled"}
                  content={x.content || ""}
                  date={x.createdAt || "Unknown date"}
                  imagelink={x.imagelink}
                />
              ))
            ) : (
              <div className="text-center space-y-2">
                <div>No blogs available</div>
                <div className="text-sm text-gray-500">
                  Create your first blog
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
