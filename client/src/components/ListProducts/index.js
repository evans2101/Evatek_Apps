import list1 from "../../assets/img/list-1.png";
import list2 from "../../assets/img/list-2.png";
import list3 from "../../assets/img/list-3.png";
import list4 from "../../assets/img/list-4.png";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../../config/api";

export default function ListProducts() {
  const [products, setProducts] = useState([]);
  // get all products
  useEffect(() => {
    API.get("/products").then((res) => {
      setProducts(res.data.data.products);
    });
  }, []);
  // function that separate every 3 digits with dot
  const dot = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  return (
    <div className="lg:mx-20">
      <h2 className="text-4xl font-black text-blood mt-16 mb-12">
        Let's Order
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 ">
        {products.map((product) => (
          <Link
            key={product.id}
            to={"/detail/" + product.id}
            className="bg-pinky rounded-xl"
          >
            <img
              className="w-full h-[368px] object-cover rounded-xl"
              src={product.image}
              alt="product"
            />
            <div className="text-blood p-4">
              <h3 className="text-2xl font-bold font-noto">{product.title}</h3>
              <span className="text-lg font-thin">
                Rp. {dot(product.price)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
