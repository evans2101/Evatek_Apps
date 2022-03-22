import { useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { API } from "../../config/api";
import Sidebar from "../../components/Sidebar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  useEffect(() => {
    if (!state.user.isAdmin) {
      navigate("/");
    }
  });
  // get more user data
  useEffect(() => {
    if (state.user.id) {
      API.get(`/users/${state.user.id}`).then((res) => {
        dispatch({
          type: "SET_USER",
          payload: res.data.data.user,
        });
      });
    }
  }, []);
  return (
    <div className="flex flex-row gap-16">
      <Sidebar />
      <div className="flex-grow mt-6">
        <Outlet />
      </div>
    </div>
  );
}
