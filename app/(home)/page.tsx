import React from "react";
import Landing from "../components/landing";
import Features from "../components/features";
import Pricing from "../components/pricing";

const HomePage = () => {
  return (
    <div className="homePage">
      <Landing />
      <Features />
      <Pricing />
    </div>
  );
};

export default HomePage;
