import React, { useEffect } from 'react';
import { Layout } from "antd";
import Navbar from "./Navbar";
import TodoChart from "./ToDo/TodoChart";
import MoodChart from "./Mood/MoodChart";
import GoalProgressChart from "./Goals/GoalProgressChart";
import { setupAxiosAuth } from '../utils/axiosConfig'

const { Content } = Layout;

const Dashboard = () => {
  useEffect(() => {
    setupAxiosAuth(); 
  }, []);

  return (
    <Layout className="min-h-screen bg-gradient-to-r from-pink-100 to-blue-100">
      <Navbar />
      <Layout className="site-layout bg-transparent">
        <Content className="m-4">
          <div className="p-6 bg-white bg-opacity-70 rounded-3xl shadow-lg mb-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
              Welcome to your dashboard!
            </h1>
            <p className="text-gray-600">
              Here's an overview of your to-dos, mood trends, and goal progress.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-70 p-6 rounded-3xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Todo Overview</h2>
              <TodoChart />
            </div>
            <div className="bg-white bg-opacity-70 p-6 rounded-3xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Mood Trends</h2>
              <MoodChart />
            </div>
            <div className="bg-white bg-opacity-70 p-6 rounded-3xl shadow-lg md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Goal Progress</h2>
              <GoalProgressChart />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;