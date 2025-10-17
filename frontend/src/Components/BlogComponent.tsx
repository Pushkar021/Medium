import { Link } from "react-router-dom";

interface Blogprops {
  name: string;
  title: string;
  content: string;
  date: string;
  id: string | number;
  imagelink?: string;
  variant?: "default" | "compact" | "vertical"; // Added vertical for featured
}

export const BlogComponent = ({
  name,
  title,
  content,
  date,
  id,
  imagelink,
  variant = "default",
}: Blogprops) => {
  const isCompact = variant === "compact";
  const isVertical = variant === "vertical"; // For big image on top

  return (
    <div
      className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden ${
        isCompact ? "" : "my-5"
      }`}
    >
      <Link
        to={`/blog/${id}`}
        className={`group ${
          isVertical
            ? "flex flex-col"
            : isCompact
            ? "flex flex-col sm:flex-row sm:h-28"
            : "flex flex-col sm:flex-row sm:h-40 sm:bg-white"
        }`}
      >
        {/* Image on top for vertical */}
        {isVertical && (
          <div className="w-full h-60 overflow-hidden">
            <img
              src={
                imagelink ||
                "https://thumbs.dreamstime.com/b/no-image-icon-vector-available-picture-symbol-isolated-white-background-suitable-user-interface-element-205805243.jpg"
              }
              alt={title}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        )}

        {/* Text Section */}
        <div
          className={`flex flex-col justify-between p-4  ${
            isCompact
              ? "w-full sm:w-3/4 "
              : isVertical
              ? "w-full"
              : "w-full sm:w-2/3 sm:bg-white bg-slate-200"
          }`}
        >
          <h2
            className={`text-lg font-bold text-gray-900 leading-snug ${
              isCompact ? "line-clamp-1" : "line-clamp-2"
            }`}
          >
            {title}
          </h2>

          {(!isCompact || isVertical) && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{content}</p>
          )}

          {(!isCompact || isVertical) && (
            <div className="text-xs flex items-center mt-2">
              <span className="bg-gray-900 text-white rounded-full px-2 py-0.5 text-xs">
                {`${Math.ceil(content.length / 1000)} min read`}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-2 mt-2">
            <Avatar name={name} />
            <span className="font-medium text-gray-800">{name}</span>
            <span className="text-gray-500 text-xs">{date.slice(0, 10)}</span>
          </div>
        </div>

        {/* Image on right for default/compact */}
        {!isVertical && (
          <div
            className={`my-5 flex-shrink-0 overflow-hidden rounded-r-lg ${
              isCompact
                ? "w-30 sm:w-30 h-40 sm:h-auto"
                : "w-full sm:w-50 h-56 sm:h-auto"
            }`}
          >
            <img
              src={
                imagelink ||
                "https://thumbs.dreamstime.com/b/no-image-icon-vector-available-picture-symbol-isolated-white-background-suitable-user-interface-element-205805243.jpg"
              }
              alt={title}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        )}
      </Link>
    </div>
  );
};

interface AvatarProps {
  name: string;
}

function Avatar({ name }: AvatarProps) {
  return (
    <div className="w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full">
      <span className="text-gray-800 font-bold text-xs">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
