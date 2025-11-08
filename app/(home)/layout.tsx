import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
