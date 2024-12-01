"use client";

import { FaArrowUp } from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-black text-white py-8 px-4 ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row gap-4">
          <span>&copy; 2024 Relax Barbershop</span>
          <a href="/privacy-policy" className="hover:underline">
            Политика за поверителност
          </a>
          <a href="/terms-of-service" className="hover:underline">
            Условия за ползване
          </a>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <FaArrowUp
            onClick={scrollToTop}
            className="cursor-pointer"
          ></FaArrowUp>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
