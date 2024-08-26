import React, { PropsWithChildren } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="px-12">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
