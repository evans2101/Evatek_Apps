import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../../config/api";
import Preloader from "../../components/Preloader";

import invoice from "../../assets/img/invoice.svg";

export default function TransDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState({});
  // get transaction by id
  useEffect(() => {
    API.get(`/transactions/${id}`).then((res) => {
      setTransaction(res.data.data.transaction);
      console.log(res.data.data.transaction);
    });
    setLoading(false);
  }, []);
  // function that separate every 3 digits with dot
  const dot = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  return (
    <>
    
      <h1 className="text-3xl text-blood font-bold my-12">
        Transaction Detail
      </h1>
      {transaction.id ? (
        <>
          <div className="flex items-start gap-8">
            <div className="flex-1 space-y-4">
              <div className="text-lg text-maroon font-bold">
                Status:{" "}
                {transaction.status === "pending" && (
                  <span className="bg-yellow-500 text-white rounded-lg px-2 py-1">
                    <i className="bi bi-hourglass-split pr-2" />
                    Pending
                  </span>
                )}
                {transaction.status === "on-delivery" && (
                  <span className="bg-sky-500 text-white rounded-lg px-2 py-1">
                    <i className="bi bi-truck pr-2" />
                    On Delivery
                  </span>
                )}
                {transaction.status === "failed" && (
                  <span className="bg-red-500 text-white rounded-lg px-2 py-1">
                    <i className="bi bi-x-lg pr-2" />
                    Failed
                  </span>
                )}
                {transaction.status === "success" && (
                  <span className="bg-green-500 text-white rounded-lg px-2 py-1">
                    <i className="bi bi-check-lg pr-2" />
                    Success
                  </span>
                )}
              </div>
              <div className="text-lg text-maroon font-bold">
                Transaction ID:{" "}
                <span className="text-blood font-normal">{transaction.id}</span>
              </div>
              <div className="text-lg text-maroon font-bold">
                Total Price:{" "}
                <span className="font-normal text-blood">
                  Rp. {dot(transaction.totalPrice)}
                </span>
              </div>
              <div className="text-lg text-maroon font-bold">
                Created At:{" "}
                <span className="font-normal text-blood">
                  {new Date(transaction.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="relative border-2 border-blood  text-center justify-center rounded-md whitespace-nowrap">
                {transaction.image ? (
                  <img
                    className="mx-auto my-2 cursor-pointer w-[348px] h-[140px] object-cover rounded-lg active:h-full"
                    src={transaction.image}
                    alt="invoice"
                  />
                ) : (
                  <div className="py-3 px-8">
                    <img className="mx-auto p-2" src={invoice} alt="" />
                    <h5 className="text-md text-blood">
                      Attache of Transaction
                    </h5>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 bg-pinky rounded-xl px-8 py-6">
              <h2 className="text-2xl text-maroon font-bold mb-6">
                User Detail
              </h2>
              <div className="space-y-4">
                <div className="text-lg text-maroon font-bold">
                  Name:{" "}
                  <span className="font-normal text-blood">
                    {transaction.user.fullName}
                  </span>
                </div>
                <div className="text-lg text-maroon font-bold">
                  Email:{" "}
                  <span className="font-normal text-blood">
                    {transaction.user.email}
                  </span>
                </div>
                <div className="text-lg text-maroon font-bold">
                  Phone:{" "}
                  <span className="font-normal text-blood">
                    {transaction.user.profile.phone}
                  </span>
                </div>
                <div className="text-lg text-maroon font-bold">
                  Address:{" "}
                  <span className="font-normal text-blood">
                    {transaction.user.profile.address}
                  </span>
                </div>
                <div className="text-lg text-maroon font-bold">
                  Post Code:{" "}
                  <span className="font-normal text-blood">
                    {transaction.user.profile.postCode}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl text-blood font-bold my-12">Orders</h1>
          <div className="space-y-6">
            {transaction.orders.map((order) => (
              <div key={order.id} className="flex items-start gap-8">
                <img
                  src={order.product.image}
                  alt=""
                  className="w-[124px] h-[168px] object-cover rounded-lg"
                />
                <div className="flex-1 space-y-2">
                  <div className="text-lg text-maroon font-bold">
                    Product:{" "}
                    <span className="font-normal text-blood">
                      {order.product.title}
                    </span>
                  </div>
                  <div className="text-lg text-maroon font-bold">
                    Quantity:{" "}
                    <span className="font-normal text-blood">{order.qty}</span>
                  </div>
                  <div className="text-lg text-maroon font-bold">
                    Price:{" "}
                    <span className="font-normal text-blood">
                      Rp. {dot(order.totalPrice)}
                    </span>
                  </div>
                  {order.toppings && (
                    <div className="text-lg text-maroon font-bold">
                      Topping:{" "}
                      <span className="font-normal text-blood">
                        {order.toppings.map((topping) => (
                          <span key={topping.id}>
                            {topping.title}
                            {topping.id !==
                              order.toppings[order.toppings.length - 1].id &&
                              ", "}
                          </span>
                        ))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}
