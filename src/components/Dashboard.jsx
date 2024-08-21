import React, {useEffect} from 'react';
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
    <Layout className="min-h-screen">
      <Navbar />
      <Layout className="site-layout">
        <Content className="m-4">
          <div className="p-6 bg-white rounded-lg shadow-md mb-4">
            <h1 className="text-2xl font-bold mb-4">
              Welcome to your dashboard!
            </h1>
            <p className="text-gray-600">
              Here's an overview of your to-dos, mood trends, and goal progress.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TodoChart />
            <MoodChart />
            <GoalProgressChart />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;