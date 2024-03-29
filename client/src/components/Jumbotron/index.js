import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { API } from "../../config/api";

import jumbotronimg from "../../assets/img/R.png";

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
    <div className="mb-96 lg:mb-0">
      <div className="relative flex flex-column lg:flex-row items-center px-8 lg:pl-20 lg:pr-80 py-24 lg:py-20 lg:mr-48 text-neutral-600 rounded-lg">
        <div className="space-y-10 ">
          <h2 className="text-5xl font-black font-noto">Solusi Kesehatan Terlengkap</h2>
          <h3 className="text-2xl text-emerald-500">
            Kunjungi Apotek, beli obat dan update informasi seputar kesehatan, semua bisa di Evatek!
          </h3>
          <p className="text-xl">
            Cintai keluarga anda dengan selalu konsumsi vitamin setiap harinya
          </p>
        </div>
        <img
          className="absolute w-60 -bottom-48 md:-bottom-1/2 right-0 left-0 mx-auto lg:bottom-auto lg:left-auto lg:-right-20 rounded-lg top-3"
          src={jumbotronimg}
          alt="jumbotron"
        />
      </div>
        <h2 className="text-3xl font-black text-neutral-600 mt-16 mb-12 mx-20">
            Penawaran Menarik
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:mx-20 p-2">
          
        </div>
    </div>
  );
}
