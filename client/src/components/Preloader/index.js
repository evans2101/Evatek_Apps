import { useEffect, useState } from "react";

import preloader from "../../assets/img/giphy.gif";

export default function Preloader() {
  // dynamic three dots
  const [dots, setDots] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((dots) => {
        if (dots.length === 3) {
          return "";
        }
        return dots + ".";
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col justify-center items-center h-[70vh]">
      <img className="w-[200px] h-[200px]" src={preloader} alt="preloader" />
      <h3 className="text-center text-2xl text-maroon">Loading{dots}</h3>
    </div>
  );
}
