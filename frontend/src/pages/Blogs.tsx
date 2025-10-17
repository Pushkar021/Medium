import { useEffect, useState } from "react";
import { BlogComponent } from "../Components/BlogComponent";
import { useBlogs, useDebounce } from "../hooks/index";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { Appbar } from "../Components/Appbar";
import toast, { Toaster } from "react-hot-toast";
import {motion} from "framer-motion"


export const Blogs = () => {
  const navigate = useNavigate()
  const { loading, blogs } = useBlogs();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search || null);
const picture = localStorage.getItem("picture")
  const name = localStorage.getItem("Name") || "User"; // Replace with actual user name logic

interface AvatarProps {
  name: string | null;
  picture: string | null;
}
interface Blog {
  id: string;
  autherName?: string;
  title?: string;
  content?: string;
  createdAt?: string;
  imagelink?: string;
}

function Avatar({ name, picture }: AvatarProps) {
  return (
    <div className="relative inline-flex items-center justify-center h-8 w-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
      {picture ? (
        <img
          src={picture}
          alt="profile"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-medium text-gray-600 dark:text-gray-300">
          {(name?.charAt(0) || "U").toUpperCase()}
        </span>
      )}
    </div>
  );
}


  useEffect(() => {
if(!localStorage.getItem("token")){
  navigate("/signin")
}

  }, [debouncedSearch,search]);
  


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
        <Appbar/>
      <Toaster/>
        <div className="flex justify-center items-center mt-70">Loading blogs...</div>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div>
        <div className="flex justify-center items-center h-screen">
          No blogs available
        </div>
      </div>
    );
  }

  const featured = blogs[0] as Blog;
  const featured2 = blogs[1] as Blog;
  const others = blogs.slice(2);

  return (
    <div>
      {/* Inline Appbar */}
      <div className="flex justify-between items-center p-2 shadow-md bg-white dark:bg-gray-900">
        {/* Logo */}

        <div className="ml-5 font-bold text-lg text-gray-900 dark:text-white">
          Medium
        </div>

        {/* Search */}
        <div className="sm:w-96 w-35">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Blog"
            className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-white dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <Link to="/create">
            <button className="items-center space-x-2 bg-white text-black hover:bg-black hover:text-white font-bold py-2 px-4 rounded-2xl transition-colors duration-500 ease-in-out flex justify-center">
              <PlusIcon className="h-5 sm:w-5" />
              <span className="sm:block hidden">Create Blog</span>
            </button>
          </Link>

          <Link to="/user">
            <Avatar name={name} picture={picture} />
          </Link>
        </div>
      </div>

      <motion.main
        className=""
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1 }}
      >
        {/* Blogs layout */}
        <div className="flex flex-col md:flex-row pt-5 px-4 md:px-10 gap-6">
          {/* Search Results or Featured Layout */}
          {debouncedSearch &&
          debouncedSearch.message &&
          debouncedSearch.message.length > 0 &&
          search != "" ? (
            <div className="w-full">
              {/* Display debounced filtered results */}
              {debouncedSearch.message.map(
                (
                  b: {
                    id: string;
                    autherName?: string;
                    title?: string;
                    content?: string;
                    createdAt?: string;
                    imagelink?: string;
                  },
                  i: number
                ) => (
                  <BlogComponent
                    key={b.id || i}
                    id={b.id}
                    name={b.autherName || "Unknown"}
                    title={b.title || "Untitled"}
                    content={b.content || ""}
                    date={b.createdAt || "Unknown date"}
                    imagelink={b.imagelink}
                  />
                )
              )}
            </div>
          ) : (
            <>
              {/* Left side - Featured Blogs */}
              <div className="md:w-1/2">
                <BlogComponent
                  id={featured.id}
                  name={featured.autherName || "Unknown"}
                  title={featured.title || "Untitled"}
                  content={featured.content || ""}
                  date={featured.createdAt || "Unknown date"}
                  imagelink={featured.imagelink}
                  variant="vertical"
                />
                <BlogComponent
                  id={featured2.id}
                  name={featured2.autherName || "Unknown"}
                  title={featured2.title || "Untitled"}
                  content={featured2.content || ""}
                  date={featured2.createdAt || "Unknown date"}
                  imagelink={featured2.imagelink}
                  variant="vertical"
                />
              </div>

              {/* Right side - Other Blogs */}
              <div className="md:w-1/2 flex flex-col ">
                {others.map(
                  (
                    x: {
                      id: string|number;
                      autherName?: string;
                      title?: string;
                      content?: string;
                      createdAt?: string;
                      imagelink?: string;
                    },
                    index
                  ) => (
                    <BlogComponent
                      key={x.id || index}
                      id={x.id || index}
                      name={x.autherName || "Unknown"}
                      title={x.title || "Untitled"}
                      content={x.content || ""}
                      date={x.createdAt || "Unknown date"}
                      imagelink={x.imagelink}
                    />
                  )
                )}
              </div>
            </>
          )}
        </div>
      </motion.main>
    </div>
  );
};
