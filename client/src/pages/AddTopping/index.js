import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../../config/api";
import Alert from "../../components/Alert";
import Preloader from "../../components/Preloader";

import toping from "../../assets/img/toping-big.png";
import attachment from "../../assets/img/attachment.svg";

export default function AddTopping() {
  const params = useParams();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  // store data with useState as form
  const [form, setForm] = useState({
    title: null,
    price: null,
    image: null,
  });
  // get topping data if on update page
  useEffect(() => {
    if (params.id) {
      API.get(`/toppings/${params.id}`).then((res) => {
        setForm({ ...res.data.data, image: null });
        setPreview(res.data.data.image);
      });
    }
    setLoading(false);
  }, []);
  const { title, price, image } = form;
  const [preview, setPreview] = useState(image);
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
  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Set Content-Type to multipart/form-data into headers as config
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    // store data with FormData
    const data = new FormData();
    data.set("title", title);
    data.set("price", price);
    if (image && !(image === preview)) {
      data.set(
        "image",
        document.getElementById("image").files[0],
        document.getElementById("image").files[0].name
      );
    }
    // update or insert topping data to API
    if (params.id) {
      API.patch(`/toppings/${params.id}`, data, config)
        .then((res) => {
          setAlert({
            status: "success",
            message: "Topping has been updated",
          });
        })
        .catch((err) => {
          if (err.response) {
            setAlert(err.response.data);
          }
        });
    } else {
      API.post("/toppings", data, config)
        .then((res) => {
          setAlert({
            status: "success",
            message: "Topping has been added",
          });
          setForm({
            title: null,
            price: null,
            image: null,
          });
        })
        .catch((err) => {
          if (err.response) {
            setAlert(err.response.data);
          }
        });
    }
  };

  return loading ? (
    <Preloader />
  ) : (
    <>
      <div className="flex flex-col lg:flex-row gap-36">
        <div className="flex-grow">
          <form onSubmit={handleSubmit}>
            <h2 className="text-3xl text-blood font-bold">
              {params.id ? "Update" : "Add"} Topping
            </h2>
            <Alert alert={alert} setAlert={setAlert} />
            <div className="space-y-8  mt-12">
            <div
              className="flex p-4 mb-2 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
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
                Topping.
              </div>
            </div>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={handleChange}
                className="bg-smooth border-2 border-blood text-gray-900 text-sm rounded-md focus:ring-red-800 focus:border-red-800 block w-full p-4 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Title Topping"
                required
              />
              <input
                type="number"
                name="price"
                id="price"
                value={price}
                onChange={handleChange}
                className="bg-smooth border-2 border-blood text-gray-900 text-sm rounded-md focus:ring-red-800 focus:border-red-800 block w-full p-4 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Price"
                required
              />
              <div className="relative">
                <div className="flex absolute inset-y-0 right-0 items-center pr-6 pointer-events-none">
                  <img src={attachment} alt="" />
                </div>
                <input
                  type="file"
                  name="image"
                  id="image"
                  onChange={handleChange}
                  className="bg-smooth border-2 border-blood text-gray-900 text-sm rounded-md focus:ring-red-800 focus:border-red-800 block w-full p-4 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white file:hidden"
                />
              </div>
            <div className="flex justify-center">
              <button className="text-center text-white bg-blood w-[100%] py-2.5 mt-3 rounded-md hover:bg-red-600 focus:bg-red-900 focus:ring-4 focus:ring-red-200">
                {params.id ? "Update" : "Add"} Topping
              </button>
            </div>
            </div>
          </form>
        </div>
        <img
          className="w-[336px] h-[336px] mx-15 mt-12 object-cover rounded-full"
          src={preview ?? toping}
          alt=""
        />
      </div>
    </>
  );
}
