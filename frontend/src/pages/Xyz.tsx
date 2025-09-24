import React, { useEffect, useState } from "react";
import { BlogComponent } from "../Components/SavedBlogComponent";
import { Appbar } from "../Components/Appbar";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const backendUrl = import.meta.env.VITE_DATABASE_URL;

export const Xyz = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchSavedBlogs = async () => {
      try {
        const res = await axios.get(
          ` ${backendUrl}/api/v1/blog/savedblog`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setBlogs(res.data.posts || []);
      } catch (err) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchSavedBlogs();
  }, []);

  if (loading) {
    toast.loading("Fetching Blogs...", {
      id: "auth",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    return (
      <div className=" h-screen">
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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {blogs.length > 0 ? (
          <>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r bg-black">
              Saved Blogs
            </h1>
            <div className="flex flex-col pt-5 items-center">
              <div className="w-full max-w-2xl">
                {blogs.map((x, index) => (
                  <BlogComponent
                    key={x.id || index}
                    id={x.id || index}
                    name={x.autherName || "Unknown"}
                    title={x.title || "Untitled"}
                    content={x.content || ""}
                    date={x.createdAt || "Unknown date"}
                    imagelink={x.imagelink}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600">
            <div>No saved blogs available</div>
            <div>Save your favorite blogs</div>
          </div>
        )}
      </div>
    </div>
  );
};
