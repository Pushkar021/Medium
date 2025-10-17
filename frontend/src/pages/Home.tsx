import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";


export const Home: React.FC = () => {
  return (
    <div className="h-screen overflow-hidden bg-gray-900 text-gray-100 flex flex-col justify-between">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center py-6 px-6 border-b border-gray-700">
        <h1 className="text-3xl font-bold tracking-wide text-gray-100">
          Medium
        </h1>
        <div className="space-x-4">
          <Link to="/signin">
            <button className="px-5 py-2 rounded-2xl bg-gray-800 hover:bg-gray-700 transition duration-300">
              Sign In
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-5 py-2 rounded-2xl bg-gray-700 hover:bg-gray-600 transition duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.main
        className="flex flex-col items-center text-center flex-1 justify-center px-6 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-5xl font-semibold mb-4">Welcome to Medium</h2>
        <p className="text-gray-400 text-lg max-w-2xl mb-8">
          A place to share your thoughts, ideas, and stories with the world.
          Join now and start writing today.
        </p>
        <div className="space-x-4 mb-12">
          <Link to="/signin">
            <button className="px-6 py-3 bg-gray-700 rounded-2xl hover:bg-gray-600 transition">
              Get Started
            </button>
          </Link>
        </div>

        {/* Example Blog Cards */}
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border border-gray-700 bg-gray-800 p-6 rounded-2xl w-80 hover:bg-gray-700 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Blog title {i}</h3>
              <p className="text-gray-400 text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit,
                repellendus!
              </p>
            </div>
          ))}
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="py-4 text-gray-500 text-sm border-t border-gray-800 w-full text-center">
        © 2025 Medium. All rights reserved.
      </footer>
    </div>
  );
};
