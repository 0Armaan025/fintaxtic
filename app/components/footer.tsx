import React from "react";
import { Poppins } from "next/font/google";

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const Footer = () => {
  return (
    <footer
      className={`w-full text-center py-4 border-t border-gray-200 text-gray-500 text-sm ${poppinsFont.className}`}
    >
      © {new Date().getFullYear()} Fintaxtic — All rights reserved.
    </footer>
  );
};

export default Footer;
