import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Modal from "react-modal";
import Login from "../Login";
import Register from "../Register";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ModalAuth() {
  const location = useLocation();
  const query = useQuery();
  return (
    <>
      <Modal
        isOpen={query.get("a") === "login"}
        onRequestClose={() => location.push("/")}
        contentLabel="Login modal"
        style={{
          content: {
            backgroundColor: "#fff",
            top: "33%",
            bottom: "auto",
            left: "50%",
            right: "auto",
          },
        }}
      >
        <Login />
      </Modal>
      <Modal
        isOpen={query.get("a") === "register"}
        onRequestClose={() => location.push("/")}
        contentLabel="Register modal"
        style={{
          content: {
            backgroundColor: "#fff",
            top: "33%",
            bottom: "auto",
            left: "50%",
            right: "auto",
          },
        }}
      >
        <Register />
      </Modal>
    </>
  );
}
