import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { API } from "../../config/api";

import jumbotronimg from "../../assets/img/jumbotron-img.png";
import slice from "../../assets/img/slice.png";

export default function Jumbotron() {
  const [state, dispatch] = useContext(UserContext);
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
    <div className="mb-96 lg:mx-20 lg:mb-0">
      <div className="relative flex flex-column lg:flex-row items-center px-8 lg:pl-20 lg:pr-80 py-24 lg:py-20 lg:mr-48 bg-blood text-white rounded-lg">
        <img className="absolute top-0 -left-24" src={slice} alt="slice" />
        <img
          className="absolute right-0 md:right-48 top-0"
          src={slice}
          alt="slice"
        />
        <img className="absolute -bottom-8 -right-24" src={slice} alt="slice" />
        <img
          className="absolute rotate-90 -bottom-16 left-1/3"
          src={slice}
          alt="slice"
        />
        <div className="space-y-12 lg:pr-72">
          <h1 className="text-6xl font-black font-noto">WAYBUCKS</h1>
          <h3 className="text-3xl">
            Things are changing, but we’re still here for you
          </h3>
          <p className="text-xl">
            We have temporarily closed our in-store cafes, but select grocery
            and drive-thru locations remaining open. Waysbucks Drivers is also
            available
          </p>
          <p className="text-xl mt-5">Let's Order...</p>
        </div>
        <img
          className="absolute w-3/4 -bottom-48 md:-bottom-1/2 right-0 left-0 mx-auto lg:bottom-auto lg:left-auto lg:-right-44 lg:w-1/2 rounded-lg"
          src={jumbotronimg}
          alt="jumbotron"
        />
      </div>
    </div>
  );
}
