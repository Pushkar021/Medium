import { PlusIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export const Appbar = () => {
  const picture = localStorage.getItem("picture");
  const name = localStorage.getItem("Name") || "User";

  return (
    <div className="flex justify-between items-center p-2 shadow-md bg-white dark:bg-gray-900">
      {/* Logo / Title */}
      <Link to="/blogs">
        <div className="ml-5 font-bold text-lg text-gray-900 dark:text-white">
          Medium
        </div>
      </Link>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <Link to="/create">
          <button className="flex items-center space-x-2 bg-white text-black hover:bg-black hover:text-white font-bold py-2 px-4 rounded-2xl transition-colors duration-500 ease-in-out">
            <PlusIcon className="h-5 w-5" />
            <span className="sm:block hidden">Create Blog</span>
          </button>
        </Link>

        <Link to="/user">
          <Avatar name={name} picture={picture} />
        </Link>
      </div>
    </div>
  );
};

interface AvatarProps {
  name: string;
  picture: string | null;
}

function Avatar({ name, picture }: AvatarProps) {
  return (
    <div className="relative inline-flex items-center justify-center h-8 w-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
      {picture && picture!=null ? (
        <img
          src={picture}
          alt="profile"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-medium text-gray-600 dark:text-gray-300">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
