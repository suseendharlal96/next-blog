import React from "react";
import Head from "next/head";
const Layout = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Suseendhar's Works</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2>All My Works</h2>
      {children}
    </div>
  );
};

export default Layout;
