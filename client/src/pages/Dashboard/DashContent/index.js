import { useEffect, useState } from "react";
import { API } from "../../../config/api";
import Preloader from "../../../components/Preloader";
import Sidebar from "../../../components/Sidebar";

export default function DashContent() {
  document.title = "Dashboard | WaysBucks";
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState({
    users: 0,
    products: 0,
    toppings: 0,
    transactions: 0,
  });
  // get total data
  const getTotal = async () => {
    const users = await API.get("/users");
    const products = await API.get("/products");
    const toppings = await API.get("/toppings");
    const transactions = await API.get("/transactions");
    setTotal({
      users: users.data.data.users.length,
      products: products.data.data.products.length,
      toppings: toppings.data.data.toppings.length,
      transactions: transactions.data.data.transactions.length,
    });
  };
  useEffect(() => {
    getTotal();
    setLoading(false);
  }, []);
  return loading ? (
    <Preloader />
  ) : (
    <>
  <div class="intro-y flex items-center h-10">
    <h2 class="text-lg font-medium truncate mr-5">General Report</h2>
      <a href="" class="ml-auto flex items-center text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" icon-name="refresh-ccw" data-lucide="refresh-ccw" class="lucide lucide-refresh-ccw w-4 h-4 mr-3"><path d="M3 2v6h6"></path><path d="M21 12A9 9 0 006 5.3L3 8"></path><path d="M21 22v-6h-6"></path><path d="M3 12a9 9 0 0015 6.7l3-2.7"></path></svg> Reload Data
      </a>
  </div>
  <div class="w-full px-30 lg:w-full">
    <div class="grid gap-4 lg:grid-cols-3"></div>
    <div class="flex items-center px-4 py-6 bg-gray-100 rounded-md shadow-md">
      

    <div class="flex items-center px-4 py-6 mx-3 bg-green-200 rounded-md shadow-md">
      <div class="p-3 bg-indigo-600 rounded">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <div className="grid grid-cols-4 gap-5 mx-4">    
      <div className=" text-2xl font-semibold text-gray-700">
      <div className="text-xl">
          <span className="text-2xl">{total.users}</span><br />
          Users
        </div>
      </div>
      </div>
    </div>

    <div class="flex items-center px-4 py-6 bg-green-200 rounded-md shadow-md">
      <div class="p-3 bg-indigo-600 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="grid grid-cols-4 gap-5 mx-4">    
      <div className=" text-2xl font-semibold text-gray-700">
      <div className="text-xl">
          <span className="text-2xl">{total.products}</span><br />
          Obat
        </div>
      </div>
      </div>
    </div>


    <div class="flex items-center px-4 py-6 mx-3 bg-green-200 rounded-md shadow-md">
      <div class="p-3 bg-indigo-600 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="grid grid-cols-4 gap-5 mx-4">    
      <div className=" text-2xl font-semibold text-gray-700">
          <div className="text-xl">
            <span className="text-2xl">{total.toppings}</span><br />
            Vitamin
          </div>
        </div>
      </div>
    </div>



    <div class="flex items-center px-4 py-6 bg-green-200 rounded-md shadow-md">
      <div class="p-3 bg-indigo-600 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="grid grid-cols-4 gap-5 mx-4">    
      <div className=" text-2xl font-semibold text-gray-700">          <div className="text-xl">
            <span className="text-2xl">{total.transactions}</span><br />
            Transactions{" "}
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>

  
    </>
  );
}
