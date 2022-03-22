import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { API } from "../../config/api";
import Alert from "../../components/Alert";
import Preloader from "../../components/Preloader";

export default function Detail() {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [product, setProduct] = useState({
    id: "",
    title: "",
    price: 0,
    image: "",
  });
  const [state, dispatch] = useContext(UserContext);
  const [initialPrice, setInitialPrice] = useState(0);
  const [price, setPrice] = useState(initialPrice);
  const [toppings, setToppings] = useState([]);
  useEffect(() => {
    if (!state.isLogin) {
      navigate("/?a=login");
    }
    if (state.user.isAdmin) {
      navigate("/dashboard/index");
    }
    API.get(`/products/${params.id}`).then((res) => {
      setProduct(res.data.data);
      setInitialPrice(res.data.data.price);
      setPrice(res.data.data.price);
    });
    API.get("/toppings").then((res) => {
      setToppings(res.data.data.toppings);
    });
    setLoading(false);
  }, []);
  const [selectedToppings, setSelectedToppings] = useState([]);
  // calculate price
  useEffect(() => {
    let total = 0;
    selectedToppings.forEach((topping) => {
      total += parseInt(topping.price);
    });
    setPrice(total + initialPrice);
  }, [selectedToppings]);

  const [form, setForm] = useState({
    userId: state.user.id,
    productId: parseInt(params.id),
    toppings: [],
    qty: 1,
    totalPrice: 0,
  });
  useEffect(() => {
    setPrice(price + initialPrice);
  }, [initialPrice]);
  // handle input change
  const handleChange = (e) => {
    if (e.target.checked) {
      setSelectedToppings([
        ...selectedToppings,
        { id: e.target.name, price: e.target.value },
      ]);
      setForm({
        ...form,
        toppings: [...form.toppings, e.target.name],
      });
    } else {
      setSelectedToppings(
        selectedToppings.filter((topping) => topping.id !== e.target.name)
      );
      setForm({
        ...form,
        toppings: form.toppings.filter((topping) => topping !== e.target.name),
      });
    }
  };
  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataOrder = {
      userId: form.userId,
      productId: form.productId,
      qty: form.qty,
      totalPrice: parseInt(price),
    };
    try {
      // insert order
      const res = await API.post("/orders", dataOrder);
      // insert order toppings
      form.toppings.forEach((topping) => {
        API.post(`/order-toppings`, {
          orderId: res.data.data.order.id,
          toppingId: topping,
        });
      });
      setAlert({
        status: "success",
        message: "Order has been placed, check your cart",
      });
    } catch (err) {
      setAlert({
        status: "error",
        message: err.response.data.message,
      });
    }
  };
  useEffect(() => {
    if (state.user.id) {
      API.get(`/users/${state.user.id}`).then((res) => {
        dispatch({
          type: "SET_USER",
          payload: res.data.data.user,
        });
      });
    }
  }, [alert]);
  document.title = `${product.title} | Evatek`;
  // function that separate every 3 digits with dot
  const dot = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  return loading ? (
    <Preloader />
  ) : (
    <div className="lg:mx-10">
      <div className="flex flex-col md:flex-row  justify-around mb-9 mt-20">
        <div className="flex flex-col shadow-[0_4px_0_0_rgba(0,0,0,1)] border-2 border-black rounded-3xl overflow-hidden m-4 p-4">
        <h1 className="text-5xl mb-2 font-black text-gray-600 font-">
          {product.title}
        </h1>
        <img
          className="group-hover:scale-105 transition-transform duration-500 object-cover w-full h-[350px] sm:h-[450px] "
          src={product.image}
          alt=""
        /><br/>
        <strong class="inline-block px-3 py-1 text-xs font-medium bg-yellow-400 w-14 ml-2">
            New
        </strong>
        <span className="text-xl text-maroon mx-3 shadow-2xl bg-slate-100 mt-2 m-3">
          Price <br /> Rp. {dot(product.price)}
        </span>
      </div>
        <div className="flex flex-col mt-52">
          <form onSubmit={handleSubmit}>
            <Alert alert={alert} setAlert={setAlert} />
            <div className="mt-4">
              <h3 className="text-3xl text-maroon font-black">Vitamin</h3>
              <p>Silahkan Pilih Vitamin kesukaan anda!</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-x-12 gap-y-10 mt-5">
                {toppings.map((topping) => (
                  <label key={topping.id} className="relative">
                    <input
                      className="absolute hidden checked:flex bottom-8 right-0 rounded-full text-blood w-6 h-6 transition-all focus:ring-blood"
                      type="checkbox"
                      name={topping.id}
                      id={topping.id}
                      value={topping.price}
                      onChange={handleChange}
                    />
                    <img
                      className="mx-auto w-[72px] h-[72px] object-cover rounded-full"
                      src={topping.image}
                      alt="toping"
                    />
                    <h5 className="text-lg text-blood text-center">
                      {topping.title}
                    </h5>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex flex-row">
                <h3 className="ml-4 text-3xl text-maroon font-bold">Total</h3>
              </div>
              <h3 className="text-3xl text-maroon font-bold">
                Rp. {dot(price)}
              </h3>
            </div>
            <button
              type="submit"
              className="w-full text-center text-white bg-gray-600 px-auto py-2.5 rounded-md hover:bg-gray-600 focus:bg-red-900 focus:ring-4 focus:ring-red-200 mt-6"
            >
              Add to Cart
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
