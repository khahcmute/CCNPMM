import React from "react";
import { Layout } from "antd";
import { Outlet, Link } from "react-router-dom";

const { Header, Content } = Layout;

const AuthLayout = () => {
  return (
    <Layout className="min-h-screen bg-gray-50">
      <Header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            E-Commerce Store
          </Link>
        </div>
      </Header>

      <Content className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <Outlet />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
