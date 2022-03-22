import { useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { API, setAuthToken } from "../../config/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Preloader from "../../components/Preloader";

import bin from "../../assets/img/bin.svg";
import invoice from "../../assets/img/invoice.svg";

export default function Cart() {
  document.title = "Cart | WaysBucks";
  // initial order
  const initialOrder = [];
  // reducer function
  const reducer = (stateOrder, action) => {
    switch (action.type) {
      case "ADD_ORDER":
        return [...stateOrder, action.payload];
      case "REMOVE_ORDER":
        return stateOrder.filter(
          (stateOrder) => stateOrder.id !== action.payload
        );
      default:
        return stateOrder;
    }
  };
  // reducer for order
  const [orders, dispatchOrders] = useReducer(reducer, initialOrder);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [state, dispatch] = useContext(UserContext);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  // get user data from state
  const user = state.user;
  // form
  const [form, setForm] = useState({
    name: user.fullName,
    email: user.email,
    phone: user.profile?.phone,
    address: user.profile?.address,
    postCode: user.profile?.postCode,
    image: null,
  });
  // get orders by user id
  useEffect(() => {
    if (state.user.id) {
      API.get(`/orders/user/${state.user.id}`).then((res) => {
        let total = 0;
        res.data.data.orders.forEach((order) => {
          if (!order.transaction) {
            total += order.totalPrice;
            dispatchOrders({
              type: "ADD_ORDER",
              payload: order,
            });
          }
        });
        setTotal(total);
        setLoading(false);
      });
    }
  }, []);
  useEffect(() => {
    if (!state.isLogin) {
      navigate("/?a=login");
    }
    if (localStorage.getItem("token")) {
      setAuthToken(localStorage.getItem("token"));
    }
  }, []);
  // delete order with toast notification without confirmation
  const deleteOrder = async (id, toppings) => {
    try {
      orders.map((order) => {
        if (order.id === id) {
          setTotal(total - order.totalPrice);
        }
      });
      // delete order toppings first
      if (toppings.length > 0) {
        await API.delete(`/order-toppings/${id}`);
      }
      // delete order
      const res = await API.delete(`/orders/${id}`);
      MySwal.fire({
        icon: "success",
        title: "Success!",
        text: "Order deleted",
      });
      dispatchOrders({
        type: "REMOVE_ORDER",
        payload: id,
      });
      if (state.user.id) {
        API.get(`/users/${state.user.id}`).then((res) => {
          dispatch({
            type: "SET_USER",
            payload: res.data.data.user,
          });
        });
      }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: `Something went wrong!. ${error}`,
      });
    }
  };
  const [preview, setPreview] = useState(null);
  // handle input change
  const handleChange = (e) => {
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
  // handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (orders.length > 0) {
        // config
        const config = {
          headers: {
            "Content-Type": "multi-part/form-data",
          },
        };
        // set form data
        const formData = new FormData();
        formData.set("userId", user.id);
        formData.set("totalPrice", total);
        formData.set("status", "pending");
        if (!form.image) {
          return MySwal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please upload invoice image",
          });
        }
        formData.set(
          "image",
          document.getElementById("image").files[0],
          document.getElementById("image").files[0].name
        );
        // post transaction first
        const resp = await API.post("/transactions", formData, config);
        // update transaction id to each order
        orders.forEach(async (order) => {
          await API.patch(`/orders/${order.id}`, {
            transactionId: resp.data.data.transaction.id,
          });
        });
        MySwal.fire({
          icon: "success",
          title: "Success!",
          text: "Transaction has been created, please wait for admin to confirm",
        });
        navigate("/");
      } else {
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: "Your cart is empty",
        });
      }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: `Something went wrong!. ${error}`,
      });
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };
  // function that separate every 3 digits with dot
  const dot = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  return loading ? (
    <Preloader />
  ) : (
    <div className="mx-5 lg:mx-20">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-24 justify-center">
          <div className="flex-1">
            <h2 className="text-3xl text-blood font-bold">My Cart</h2>
            {orders.length > 0 ? (
              <>
                <h5 className="text-xl text-blood mt-5">Review Your Order</h5>
                <hr className="w-full my-4 border border-blood"></hr>
                <div className="space-y-2">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center">
                      <img
                        className="w-[80px] h-[80px] object-cover rounded-md"
                        src={order.product.image}
                        alt="product"
                      />
                      <div className="flex flex-col ml-4 w-full space-y-2">
                        <div className="flex flex-row justify-between items-center">
                          <h5 className="text-xl text-blood font-bold">
                            {order.product.title}
                          </h5>
                          <span className="text-lg text-blood">
                            Rp. {dot(order.totalPrice)}
                          </span>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <h5 className="text-lg text-maroon">
                            Topping :{" "}
                            <span className="text-blood">
                              {order.toppings.map((topping) => (
                                // if topping is not last, add comma
                                <span key={topping.id}>
                                  {topping.title}
                                  {order.toppings.indexOf(topping) !==
                                    order.toppings.length - 1 && ", "}
                                </span>
                              ))}
                            </span>
                          </h5>
                          <button
                            onClick={() =>
                              deleteOrder(order.id, order.toppings)
                            }
                          >
                            <img src={bin} alt="" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <hr className="w-full my-4 border border-blood"></hr>
                <div className="flex-grow flex mt-6 gap-2 lg:gap-32">
                  <div className="flex flex-col w-full space-y-2">
                    <hr className="w-full mt-4 border-0.5 border-blood"></hr>
                    <div className="flex flex-row justify-between items-center">
                      <h5 className="text-lg text-blood">Subtotal</h5>
                      <span className="text-lg text-blood">
                        Rp. {dot(total)}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                      <h5 className="text-lg text-blood">Qty :</h5>
                      <span className="text-lg text-blood">
                        {orders.length}
                      </span>
                    </div>
                    <hr className="w-full my-4 border-0.5 border-blood"></hr>
                    <div className="flex flex-row justify-between items-center">
                      <h5 className="text-lg text-blood font-bold">Total</h5>
                      <span className="text-lg text-blood font-bold">
                        Rp. {dot(total)}
                      </span>
                    </div>
                  </div>
                  <label
                    htmlFor="image"
                    className="cursor-pointer border-2 border-blood bg-smooth text-center justify-center p-2 rounded-md whitespace-nowrap"
                  >
                    {preview ? (
                      <img
                        className="w-[384px] h-[132px] object-cover rounded-lg"
                        src={preview}
                        alt="preview"
                      />
                    ) : (
                      <>
                        <img className="mx-auto p-2" src={invoice} alt="" />
                        <h5 className="text-md text-blood">
                          Attache of Transaction
                        </h5>
                      </>
                    )}
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    onChange={handleChange}
                    hidden
                  />
                </div>
              </>
            ) : (
              <h5 className="text-xl text-blood mt-5">Your cart is empty</h5>
            )}
          </div>
          <div className="text-center">
            <div
              className="flex p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
              role="alert"
            >
              <svg
                className="inline flex-shrink-0 mr-3 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <div>
                <span className="font-bold">Info!</span> Fill this in the
                Profile.
              </div>
            </div>
            <div>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                className="bg-smooth border-2 border-blood text-gray-900 text-sm rounded-md focus:ring-red-800 focus:border-red-800 block w-full lg:w-80 p-4 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Name"
                required
                disabled
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                className="bg-smooth border-2 border-blood text-gray-900 text-sm rounded-md focus:ring-red-800 focus:border-red-800 block w-full lg:w-80 p-4 mt-6 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Email"
                required
                disabled
              />
            </div>
            <div>
              <input
                type="number"
                name="phone"
                id="phone"
                value={form.phone}
                className="bg-smooth border-2 border-blood text-gray-900 text-sm rounded-md focus:ring-red-800 focus:border-red-800 block w-full lg:w-80 p-4 mt-6 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Phone"
                required
                disabled
              />
            </div>
            <div>
              <input
                type="number"
                name="postCode"
                id="postCode"
                value={form.postCode}
                className="bg-smooth border-2 border-blood text-gray-900 text-sm rounded-md focus:ring-red-800 focus:border-red-800 block w-full lg:w-80 p-4 mt-6 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Post Code"
                required
                disabled
              />
            </div>
            <div>
              <textarea
                name="address"
                id="address"
                value={form.address}
                className="bg-smooth border-2 border-blood text-gray-900 text-sm rounded-md focus:ring-red-800 focus:border-red-800 block w-full lg:w-80 p-4 mt-6 h-32 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Address"
                required
                disabled
              ></textarea>
            </div>
            <button
              type="submit"
              className="text-center text-white bg-blood w-full py-2.5 mt-10 rounded-md hover:bg-red-600 focus:bg-red-900 focus:ring-4 focus:ring-red-200"
            >
              Pay
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
