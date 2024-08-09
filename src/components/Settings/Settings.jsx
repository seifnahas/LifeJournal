import React from 'react';
import { Layout } from 'antd';
import Navbar from '../Navbar';

const { Content } = Layout;

const Settings = () => {
  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Layout className="site-layout">
        <Content className="m-4 p-4 bg-white rounded-lg">
          <h1 className="text-2xl font-bold">Account Settings</h1>
          {/* Add your Goals content here */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Settings;
