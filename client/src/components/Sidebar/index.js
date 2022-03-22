import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    
    <aside className="w-100 ">
      <div className=" bg-purple-100 px-3 mx-4 py-2 mb-10 overflow-y-auto rounded-lg dark:bg-gray-800 shadow-xl">
      <div class="my-4 mb-6 mx-9 px-3">
        <h1 class="text-2xl font-bold text-green-400 text-center">Admin Dashboard</h1>
      </div>
      <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-2">
            <button type="submit" class="p-1 focus:outline-none">
              <svg fill="none" stroke="currentColor" stroke-linecap="round"
                  stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
                  class="w-4 h-4">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </span>
          <input type="search" name="search"
            class="w-full px-4 py-2 pl-12 rounded shadow outline-none" placeholder="Search...">
          </input>
      </div><br />                            
        <ul className="space-y-2">
          
          <li>
            <NavLink
              to="/dashboard/index"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="ml-3">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="products"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="flex-1 ml-3 whitespace-nowrap">Products</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="toppings"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="flex-1 ml-3 whitespace-nowrap">Toppings</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="transactions"
              className="flex items-center p-2 mb-6 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="flex-1 ml-3 whitespace-nowrap">
                Transactions
              </span>
            </NavLink>
          </li>
        </ul>
        {/* <div
          id="dropdown-cta"
          className="p-4 mt-6 rounded-lg bg-red-50 dark:bg-red-900"
          role="alert"
        >
          <div className="flex items-center mb-3">
            <span className="bg-orange-200 text-orange-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">
              Alpha
            </span>
          </div>
          <p className="mb-3 text-sm text-red-900 dark:text-red-400">
            WayBucks Dashboard Panel is currently in Alpha, and is not ready for
            use. Please do not use it for production. This panel is for testing
            purposes only. If you have any questions, please contact us at 911
          </p>
        </div> */}
      </div>
    </aside>
  )
}
