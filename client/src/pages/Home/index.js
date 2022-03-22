import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { API } from "../../config/api";

import Jumbotron from "../../components/Jumbotron";
import ListProducts from "../../components/ListProducts";
import Preloader from "../../components/Preloader";

export default function Home() {
  document.title = "Landing Page | WaysBucks";
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useContext(UserContext);
  // get more user data
  const getUserData = useCallback(async () => {
    try {
      if (state.user.id) {
        const res = await API.get(`/users/${state.user.id}`);
        dispatch({
          type: "SET_USER",
          payload: res.data.data.user,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, [state.user.id, dispatch]);
  useEffect(() => {
    getUserData();
  }, [getUserData]);
  return loading ? (
    <Preloader />
  ) : (
    <div className="mx-10 lg:mx-0">
      <Jumbotron />
      <ListProducts setLoading={setLoading} />
    </div>
  );
}
