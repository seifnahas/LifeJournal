import { Layout } from "antd";
import Navbar from "./Navbar";
import TodoChart from "./ToDo/TodoChart";

const { Content } = Layout;

const Dashboard = () => {
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
              Here's an overview of your pending todos.
            </p>
          </div>
          <TodoChart />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
