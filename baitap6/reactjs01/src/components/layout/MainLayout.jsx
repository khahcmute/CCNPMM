import React, { useState } from "react";
import { Layout, BackTop } from "antd";
import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

const { Content } = Layout;

const MainLayout = () => {
  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="flex-1">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </Content>
      <Footer />
      <BackTop />
    </Layout>
  );
};

export default MainLayout;
