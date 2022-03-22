import "./App.css";
import { API, setAuthToken } from "./config/api";
import { useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import Modal from "react-modal";

import Navbar from "./components/Navbar";
import ModalAuth from "./components/ModalAuth";
// import ChatBox from "./components/ChatBox";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import Transaction from "./pages/Dashboard/Transaction";
import Profile from "./pages/Profile";
import AddProduct from "./pages/AddProduct";
import AddTopping from "./pages/AddTopping";
import Dashboard from "./pages/Dashboard";
import DashContent from "./pages/Dashboard/DashContent";
import Product from "./pages/Dashboard/Product";
import Topping from "./pages/Dashboard/Topping";
import TransDetail from "./pages/TransDetail";

Modal.setAppElement("#root");

// If token is in localStorage, set it as default header
if (localStorage.getItem("token")) {
  setAuthToken(localStorage.getItem("token"));
}

export default function App() {
  const navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  // Redirect Auth
  useEffect(() => {
    if (!state.isLogin) {
      navigate("/?a=login");
    } else {
      if (state.user.isAdmin) {
        navigate("/dashboard/index");
      } else {
        // get more user data
        if (state.user.id) {
          API.get(`/users/${state.user.id}`).then((res) => {
            dispatch({
              type: "SET_USER",
              payload: res.data.data.user,
            });
          });
        }
      }
    }
  }, [state.isLogin]);

  // Create function for check user token
  const checkToken = () => {
    if (localStorage.getItem("token")) {
      API.get("/check-auth")
        .then((res) => {
          // Get user data
          let payload = res.data.data;
          // Get token from localStorage and set it to payload
          payload.token = localStorage.getItem("token");
          dispatch({
            type: "LOGIN",
            payload,
          });
        })
        .catch((err) => {
          localStorage.removeItem("token");
          dispatch({
            type: "LOGOUT",
          });
        });
    } else {
      dispatch({
        type: "LOGOUT",
      });
    }
  };
  useEffect(() => {
    checkToken();
  }, []);
  return (
    <div className="container ">
      <div className="relative">
        <ModalAuth />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="detail/:id" element={<Detail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<Profile />} />
          <Route path="add-topping" element={<AddTopping />} />
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="index" element={<DashContent />} />
            <Route path="transactions" element={<Transaction />} />
            <Route path="transactions/:id" element={<TransDetail />} />
            <Route path="products" element={<Product />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/:id" element={<AddProduct />} />
            <Route path="toppings" element={<Topping />} />
            <Route path="toppings/add" element={<AddTopping />} />
            <Route path="toppings/:id" element={<AddTopping />} />
          </Route>
        </Routes>
        {/* <ChatBox /> */}
      </div>
    </div>
  );
}
