import { Link } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../../context/UserContext";

export default function Dropdown({ setIsOpen, onClickOutside }) {
  const [state, dispatch] = useContext(UserContext);
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);
  return (
    <div
      ref={ref}
      className="absolute right-0 z-30 w-44 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"
    >
      <ul>
        {state.user.isAdmin ? (
          <>
            <li>
              <Link to="/dashboard/index" onClick={() => setIsOpen()}>
                <div className="block py-4 px-4 text-md text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                  <div className="flex items-center gap-4">
                    <i className="bi bi-speedometer2"></i>
                    <span>Dashboard</span>
                  </div>
                </div>
              </Link>
            </li>
            <li>
              <hr />
            </li>
          </>
        ) : null}
        <li>
          <Link to="/profile" onClick={() => setIsOpen()}>
            <div className="block py-4 px-4 text-md text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
              <div className="flex items-center gap-4">
                <i className="bi bi-person"></i>
                <span>Profile</span>
              </div>
            </div>
          </Link>
        </li>
        <li>
          <a
            onClick={() => dispatch({ type: "LOGOUT" })}
            className="cursor-pointer block py-4 px-4 text-md text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
          >
            <div className="flex items-center gap-4">
              <i className="bi bi-box-arrow-right"></i>
              <span>Logout</span>
            </div>
          </a>
        </li>
      </ul>
    </div>
  );
}
