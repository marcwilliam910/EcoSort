import {Link} from "react-router-dom";
import {FaExclamationTriangle} from "react-icons/fa"; // Import the icon from react-icons

export default function Error() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-5/6 max-w-sm p-8 text-center bg-white rounded-lg shadow-lg">
        <div className="text-4xl text-red-600 md:text-6xl">
          <FaExclamationTriangle />
        </div>
        <h1 className="mt-4 text-4xl font-bold text-red-600">404</h1>
        <h2 className="mt-2 text-2xl font-semibold text-gray-800">
          Page Not Found
        </h2>
        <p className="mt-4 text-gray-700">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 mt-6 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
