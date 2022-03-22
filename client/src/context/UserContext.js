import { createContext, useReducer } from "react";

export const UserContext = createContext();

// Define the initial state
const initialState = {
  isLogin: false,
  user: {},
};

// Define the reducer function
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "LOGIN":
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        isLogin: true,
        user: payload,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        isLogin: false,
        user: {},
      };
    case "SET_USER":
      return {
        ...state,
        user: {
          ...payload,
          isAdmin: state.user.isAdmin,
          token: state.user.token,
        },
      };
    default:
      throw new Error();
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};
