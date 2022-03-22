import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { API, setAuthToken } from "../../config/api";
import Alert from "../../components/Alert";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Preloader from "../../components/Preloader";

import avatar from "../../assets/img/avatar.jpg";
import logo from "../../assets/img/logo-small.png";

export default function Profile() {
  document.title = "Profile | WaysBucks";
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [state, dispatch] = useContext(UserContext);
  useEffect(() => {
    if (!state.isLogin) {
      navigate("/?a=login");
    }
    if (localStorage.getItem("token")) {
      setAuthToken(localStorage.getItem("token"));
    }
  }, [state]);
  const [transactions, setTransactions] = useState([]);
  // get my transactions data
  useEffect(() => {
    if (state.user.id) {
      API.get(`/transactions/user/${state.user.id}`).then((res) => {
        setTransactions(res.data.data.transactions);
        console.log(res.data.data.transactions);
      });
      setLoading(false);
    }
  }, []);
  // Get user data and set it to state
  const [form, setForm] = useState({
    fullName: state.user.fullName,
    email: state.user.email,
    image: state.user.image,
    phone: state.user.profile?.phone,
    gender: state.user.profile?.gender,
    address: state.user.profile?.address,
    postCode: state.user.profile?.postCode,
  });
  const { fullName, email, image, phone, gender, address, postCode } = form;
  const [button, setButton] = useState(false);
  const [preview, setPreview] = useState(image);
  // handle input change
  const handleChange = (e) => {
    setButton(true);
    if (e.target.name === "image") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  // handle submit
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      // configuration
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };
      // store with separated data
      const dataUser = new FormData();
      dataUser.set("fullName", fullName);
      dataUser.set("email", email);
      if (!(image === preview)) {
        dataUser.set(
          "image",
          document.getElementById("image").files[0],
          document.getElementById("image").files[0].name
        );
      }
      const dataProfile = new FormData();
      dataProfile.set("userId", state.user.id);
      dataProfile.set("phone", phone);
      dataProfile.set("gender", gender);
      dataProfile.set("address", address);
      dataProfile.set("postCode", postCode);

      const epUser = `/users/${state.user.id}`;
      const epProfile = `/profiles/${state.user.id}`;
      // update user
      await API.patch(epUser, dataUser, config);
      // insert or update profile
      if (state.user.profile) {
        await API.patch(epProfile, dataProfile, config);
      } else {
        await API.post("/profiles", dataProfile, config);
      }
      // update state
      const configGet = {
        headers: {
          "Content-type": "application/json",
        },
      };
      if (state.user.id) {
        API.get(epUser, configGet).then((res) => {
          dispatch({
            type: "SET_USER",
            payload: res.data.data.user,
          });
        });
      }
      // set button to false
      setButton(false);
      // set alert
      setAlert({
        status: "success",
        message: "Profile has been updated",
      });
    } catch (error) {
      // set alert
      setAlert({
        status: "error",
        message: error.message,
      });
    }
  };
  // update transaction status
  const updateStatus = (id) => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    API.patch(`/transactions/${id}`, { status: "success" }, config)
      .then((res) => {
        API.get(`/transactions/user/${state.user.id}`).then((res) => {
          setTransactions(res.data.data.transactions);
        });
        // modal
        MySwal.fire({
          title: "Success",
          text: "Transaction has been updated",
          icon: "success",
          confirmButtonText: "Ok",
        });
      })
      .catch((err) => {
        MySwal.fire({
          title: "Error",
          text: err.message,
          icon: "error",
          confirmButtonText: "Ok",
        });
      });
  };
  // function that separate every 3 digits with dot
  const dot = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  return loading ? (
    <Preloader />
  ) : (
    <div className="mx-5 lg:mx-10">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <h1 className="my-6 text-3xl text-blood font-bold">My Profile</h1>
          <Alert alert={alert} setAlert={setAlert} />
          <form onSubmit={handleSubmit}>
            <div className="flex">
              <div className="space-y-4">
                <label htmlFor="image">
                  <img
                    className="w-[180px] h-[222px] object-cover rounded-md cursor-pointer hover:ring-2 hover:ring-blood"
                    src={preview ?? avatar}
                    alt="avatar"
                  />
                  <input
                    type="file"
                    name="image"
                    id="image"
                    onChange={handleChange}
                    hidden
                  />
                </label>
                {button ? (
                  <button
                    type="submit"
                    className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Update
                  </button>
                ) : null}
              </div>
              <div className="ml-5 space-y-6">
                <label htmlFor="fullName" className="space-y-1">
                  <h3 className="text-xl text-maroon font-bold mb-1 ">Full Name</h3>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={fullName}
                    onChange={handleChange}
                    className="bg-smooth border-2 border-blood text-gray-900 text-sm rounded-md focus:ring-red-800 focus:border-red-800 block w-full lg:w-80 p-4 mt-6 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                </label>
                <label htmlFor="email" className="space-y-1">
                  <h3 className="text-xl text-maroon font-bold mt-2">Email</h3>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={handleChange}
                    className="bg-smooth border-2 border-blood text-gray-900 text-sm rounded-md focus:ring-red-800 focus:border-red-800 block w-full lg:w-80 p-4 mt-6 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                </label>
                <label htmlFor="phone" className="space-y-1">
                  <h3 className="text-xl text-maroon font-bold mt-2">Phone</h3>
                  <input
                    type="number"
                    name="phone"
                    id="phone"
                    value={phone}
                    onChange={handleChange}
                    className="bg-smooth border-2 border-blood text-gray-900 text-sm rounded-md focus:ring-red-800 focus:border-red-800 block w-full lg:w-80 p-4 mt-6 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                </label>
                <label htmlFor="gender" className="space-y-1">
                  <h3 className="text-xl text-maroon font-bold mt-2">Gender</h3>
                  <select
                    name="gender"
                    id="gender"
                    value={gender}
                    onChange={handleChange}
                    className="bg-smooth border-2 border-blood text-gray-900 text-sm rounded-md focus:ring-red-800 focus:border-red-800 block w-full lg:w-80 p-4 mt-6 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  >
                    {gender ? (
                      <option disabled value="">
                        Select your gender
                      </option>
                    ) : (
                      <option value="" disabled selected>
                        Select your gender
                      </option>
                    )}
                    {gender === "pria" ? (
                      <option value="pria" selected>
                        Pria
                      </option>
                    ) : (
                      <option value="pria">Pria</option>
                    )}
                    {gender === "wanita" ? (
                      <option value="wanita" selected>
                        Wanita
                      </option>
                    ) : (
                      <option value="wanita">Wanita</option>
                    )}
                  </select>
                </label>
                <label htmlFor="address" className="space-y-1">
                  <h3 className="text-xl text-maroon font-bold mt-2">Address</h3>
                  <textarea
                    name="address"
                    id="address"
                    value={address}
                    onChange={handleChange}
                    cols="30"
                    rows="3"
                    className="bg-smooth border-2 border-blood text-gray-900 text-sm rounded-md focus:ring-red-800 focus:border-red-800 block w-full lg:w-80 p-4 mt-6 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                </label>
                <label htmlFor="postCode" className="space-y-1 ">
                  <h3 className="text-xl text-maroon font-bold mt-2">Post Code</h3>
                  <input
                    name="postCode"
                    id="postCode"
                    value={postCode}
                    onChange={handleChange}
                    className="bg-smooth border-2 border-blood text-gray-900 text-sm rounded-md focus:ring-red-800 focus:border-red-800 block w-full lg:w-80 p-4 mt-6 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                </label>
              </div>
            </div>
          </form>
        </div>
        <div className="flex-1 mx-10 px-6">
          <h1 className="my-6 text-3xl text-maroon font-bold">
            My Transactions
          </h1>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col md:flex-row justify-between px-8 py-4 bg-pinky rounded-xl"
              >
                <div className="flex-grow mt-3">
                  <div className="flex flex-col space-y-4">
                    {transaction.orders.map((order) => (
                      <div className="flex gap-4">
                        <img
                          className="mb-auto w-[80px] h-[97px] rounded-md"
                          src={order.product.image}
                          alt=""
                        />
                        <div>
                          <h3 className="text-md text-blood font-bold">
                            {order.product.title}
                          </h3>
                          <h6 className="text-xs text-blood">
                            {new Date(transaction.createdAt).toLocaleString()}
                          </h6>
                          <h5 className="text-sm text-blood mt-4">
                            <span className="text-maroon">Topping : </span>
                            {order.toppings.map((topping) => (
                              <span key={topping.id}>
                                {topping.title}
                                {topping.id !==
                                order.toppings[order.toppings.length - 1].id
                                  ? ", "
                                  : null}
                              </span>
                            ))}
                          </h5>
                          <h5 className="text-sm text-maroon font-thin mt-2">
                            Price : Rp. {dot(order.totalPrice)}
                          </h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center flex-shrink my-auto">
                  <img className="mx-auto h-20 mb-2" src={logo} alt="" />
                  <button className="text-md text-center bg-gray-100 my-2 mb-3 py-1 px-2 rounded-lg text-maroon">
                    TRANSACTION ID: {transaction.id}
                  </button>
                  {transaction.status === "pending" && (
                    <h5 className="bg-yellow-200 rounded-lg px-3 py-1 mt-2 mb-2 text-yellow-400 text-center">
                      Pending
                    </h5>
                  )}
                  {transaction.status === "on-delivery" && (
                    <>
                      <h5 className="bg-sky-200 rounded-lg px-3 py-1 mt-2 mb-2 text-sky-400 text-center">
                        On Delivery
                      </h5>
                      <button
                        onClick={() => updateStatus(transaction.id)}
                        className="mt-4 bg-blood px-2 py-1 rounded-2xl mb-2 hover:bg-red-900 text-center text-white"
                      >
                        Delivered
                      </button>
                    </>
                  )}
                  {transaction.status === "success" && (
                    <h5 className="bg-green-200 rounded-lg px-3 py-1 mt-2 mb-2 text-green-400 text-center">
                      Success
                    </h5>
                  )}
                  {transaction.status === "failed" && (
                    <h5 className="bg-red-200 rounded-lg px-3 py-1 mt-2 mb-2 text-red-400 text-center">
                      Failed
                    </h5>
                  )}
                  <h6 className="text-maroon text-sm text-center font-bold mt-2 mb-10">
                    Sub Total: {dot(transaction.totalPrice)}
                  </h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
