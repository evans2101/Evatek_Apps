import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API, setAuthToken } from "../../../config/api";
import Preloader from "../../../components/Preloader";
import DashContent from "../DashContent";


export default function Transaction() {
  document.title = "Transactions | WaysBucks";
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  // get all transactions
  useEffect(() => {
    API.get("/transactions").then((res) => {
      setTransactions(res.data.data.transactions);
      console.log(res.data.data.transactions);
    });
    if (localStorage.getItem("token")) {
      setAuthToken(localStorage.getItem("token"));
    }
    setLoading(false);
  }, []);
  // update transaction status to failed or success
  const updateTransaction = (id, status) => {
    API.patch(`/transactions/${id}`, {
      status,
    }).then((res) => {
      setTransactions(
        transactions.map((transaction) => {
          if (transaction.id === id) {
            return {
              ...transaction,
              status,
            };
          }
          return transaction;
        })
      );
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


      <div className="flex flex-col">
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
                    {/* <th
                      scope="col"
                      className="py-4 border text-xs font-bold tracking-wider text-center text-gray-700 uppercase dark:text-gray-400"
                    >
                      Date
                    </th> */}
                    <th
                      scope="col"
                      className="py-4 border text-xs font-bold tracking-wider text-center text-gray-700 uppercase dark:text-gray-400"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="py-4 border text-xs font-bold tracking-wider text-center text-gray-700 uppercase dark:text-gray-400"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="py-4 border text-xs font-bold tracking-wider text-center text-gray-700 uppercase dark:text-gray-400"
                    >
                      Post Code
                    </th>
                    <th
                      scope="col"
                      className="py-4 border text-xs font-bold tracking-wider text-center text-gray-700 uppercase dark:text-gray-400"
                    >
                      Income
                    </th>
                    <th
                      scope="col"
                      className="py-4 border text-xs font-bold tracking-wider text-center text-gray-700 uppercase dark:text-gray-400"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="py-4 border text-xs font-bold tracking-wider text-center text-gray-700 uppercase dark:text-gray-400"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions&&transactions.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className="bg-white border dark:bg-gray-800"
                    >
                      <td className="py-4 px-6 border text-md font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {index + 1}
                      </td>
                      {/* <td className="py-4 px-6 border text-md text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {transaction.user.Date}
                      </td> */}
                      <td className="py-4 px-6 border text-md text-gray-500 whitespace-nowrap dark:text-gray-400">
                        <Link
                          to={`${transaction.id}`}
                          className="hover:underline"
                        >
                        {transaction.user.fullName}
                        </Link>
                      
                      </td>
                      <td className="py-4 px-6 border text-md text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {transaction.user.profile.address}
                      </td>
                      <td className="py-4 px-6 border text-md text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {transaction.user.profile.postCode}
                      </td>
                      <td className="py-4 px-6 border text-md text-blue-500 whitespace-nowrap dark:text-gray-400">
                          Rp. {dot(transaction.totalPrice)}
                      </td>
                      <td className="py-4 px-6 border text-md whitespace-nowrap dark:text-gray-400">
                        {transaction.status === "pending" && (
                          <div className="text-yellow-300">Pending</div>
                        )}
                        {transaction.status === "on-delivery" && (
                          <div className="text-sky-500">On Delivery</div>
                        )}
                        {transaction.status === "success" && (
                          <div className="text-green-500">Success</div>
                        )}
                        {transaction.status === "failed" && (
                          <div className="text-red-500">Failed</div>
                        )}
                      </td>
                      <td className="w-48 py-4 px-6 border text-md text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {transaction.status === "pending" && (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() =>
                                updateTransaction(transaction.id, "failed")
                              }
                              className="flex-1 px-4 py-1 bg-red-500 text-white hover:bg-red-800 rounded-xl"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() =>
                                updateTransaction(transaction.id, "on-delivery")
                              }
                              className="flex-1 px-4 py-1 bg-green-500 text-white hover:bg-green-800 rounded-xl"
                            >
                              Approve
                            </button>
                          </div>
                        )}
                        {transaction.status === "on-delivery" && (
                          <i className="bi bi-truck bg-sky-500 px-1.5 py-1 text-white rounded-full"></i>
                        )}
                        {transaction.status === "success" && (
                          <i className="bi bi-check-lg bg-green-500 px-1.5 py-1 text-white rounded-full"></i>
                        )}
                        {transaction.status === "failed" && (
                          <i className="bi bi-x-lg bg-red-500 px-1.5 py-1 text-white rounded-full"></i>
                        )}
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
