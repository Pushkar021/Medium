import axios from "axios";
import { Link } from "react-router-dom";
const backendUrl= import.meta.env.VITE_DATABASE_URL;

interface Blogprops {
  name: string;
  title: string;
  content: string;
  date: string;
  id: string|number;
  imagelink?: string;
}

export const BlogComponent = ({

  title,
  content,
  id,
  imagelink,
}: Blogprops) => {
  const handleclick = async () => {
    const x = confirm("Do you really want to Delete the blog?");
    if (x) {
      await axios.delete(
        `${backendUrl}/api/v1/blog/savedblog/${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      window.location.reload();
    }
  };
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden my-5">
      <div className="flex h-40 group cursor-pointer">
        {/* Left side - text */}
        <div className="flex flex-col justify-between p-4 w-2/3">
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">
              {title}
            </h2>

            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{content}</p>
          </div>

          <div className="text-xs text-gray-500 flex items-center">
            <Link to={`/blog/${id}`}>
              <button className="bg-slate-900 text-white w-20 h-8 flex items-center justify-center p-2 rounded-2xl hover:scale-105 hover:bg-slate-700 transition-all duration-300">
                View
              </button>
            </Link>

            <button
              onClick={handleclick}
              className="ml-2 bg-red-900 text-white w-20 h-8 flex items-center justify-center p-2 rounded-2xl hover:scale-105 hover:bg-red-700 transition-all duration-300"
            >
              Remove
            </button>
          </div>
          {/* <div className="flex items-center space-x-2 mb-1">
            <Avatar name={name} />
            <span className="font-medium text-gray-800">{name}</span>
            <span className="text-gray-500 text-xs">{date}</span>
          </div> */}
        </div>

        {/* Right side - image */}
        <div className="sm:w-50 w-30 my-5 flex-shrink-0 overflow-hidden rounded-r-lg">
          <img
            src={
              imagelink
                ? imagelink
                : "https://thumbs.dreamstime.com/b/no-image-icon-vector-available-picture-symbol-isolated-white-background-suitable-user-interface-element-205805243.jpg"
            }
            alt={title}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
};


