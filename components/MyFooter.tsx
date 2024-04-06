"use client";
import { Link as ScrollLink } from "react-scroll";
import { FaArrowUp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row gap-4">
          <span>&copy; 2024 Barbershop</span>
          <a href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="hover:underline">
            Terms of Service
          </a>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <ScrollLink
            to="hero"
            spy={true}
            smooth={true}
            offset={50}
            duration={500}
            className="cursor-pointer"
          >
            <FaArrowUp></FaArrowUp>
          </ScrollLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
