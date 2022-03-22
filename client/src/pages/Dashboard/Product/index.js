import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../../../config/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Preloader from "../../../components/Preloader";
import DashContent from "../DashContent";

export default function Product() {
  document.title = "Products | WaysBucks";
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  // get all products
  useEffect(() => {
    API.get("/products").then((res) => {
      setProducts(res.data.data.products);
      setLoading(false);
    });
  }, []);
  const MySwal = withReactContent(Swal);
  const deleteProduct = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.value) {
        API.delete(`/products/${id}`).then((res) => {
          MySwal.fire("Deleted!", "Your file has been deleted.", "success");
          setProducts(products.filter((product) => product.id !== id));
        });
      }
    });
  };
  // function that separate every 3 digits with dot
  const dot = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  return loading ? (
    <Preloader />
  ) : (
    <>
    <DashContent /><br />
      <div className="flex justify-between">
        <Link
          to="add"
          className="mt-auto text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Add Obat
        </Link>
      </div>
      <div className="flex flex-col mb-5">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-md sm:rounded-lg">
              <table className="min-w-full">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="py-4 border text-xs font-bold tracking-wider text-center text-gray-700 uppercase dark:text-gray-400"
                    >
                      No
                    </th>
                    <th
                      scope="col"
                      className="py-4 border text-xs font-bold tracking-wider text-center text-gray-700 uppercase dark:text-gray-400"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="py-4 border text-xs font-bold tracking-wider text-center text-gray-700 uppercase dark:text-gray-400"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="py-4 border text-xs font-bold tracking-wider text-center text-gray-700 uppercase dark:text-gray-400"
                    >
                      Image
                    </th>
                    {/* <th
                      scope="col"
                      className="py-4 border text-xs font-bold tracking-wider text-center text-gray-700 uppercase dark:text-gray-400"
                    >
                      Rating
                    </th> */}
                    <th
                      scope="col"
                      className="py-4 border text-xs font-bold tracking-wider text-center text-gray-700 uppercase dark:text-gray-400"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={product.id}
                      className="bg-white border dark:bg-gray-800"
                    >
                      <td className="py-4 border text-md text-center text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {index + 1}
                      </td>
                      <td className="py-4 border text-md text-center text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {product.title}
                      </td>
                      <td className="py-4 border text-md text-center text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {dot(product.price)}
                      </td>
                      <td className="relative py-4 px-6 border text-md text-gray-500 whitespace-nowrap dark:text-gray-400">
                        <img
                          className="w-[43px] h-[55px] object-cover rounded-lg active:absolute active:w-[215px] active:h-[275px] active:z-10 -top-full -left-1/4 ml-auto mr-auto"
                          src={product.image}
                          alt="image"
                        />
                      </td>
                      {/* <td className="py-4 border text-md text-center text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {product.rating}
                      </td> */}
                      <td className="py-4 px-6 border text-md text-gray-500 whitespace-nowrap dark:text-gray-400">
                        <div className="flex gap-8 justify-around">
                          <Link
                            to={"" + product.id}
                            className="flex-1 py-1 bg-sky-500 text-white text-center hover:bg-sky-800 rounded-xl"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Link>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="flex-1 py-1 bg-red-500 text-white hover:bg-red-800 rounded-xl"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
