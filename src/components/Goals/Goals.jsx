import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Navbar from '../Navbar';
import GoalsModal from './GoalsModal';
import GoalItem from './GoalsItem';
import axios from 'axios';
import { setupAxiosAuth } from '../../utils/axiosConfig';

const { Content } = Layout;

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  useEffect(() => {
    setupAxiosAuth()
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/goals', { withCredentials: true });
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
    setModalVisible(true);
  };

  const handleCreate = async (values) => {
    try {
      const response = await axios.post('http://localhost:3000/api/goals', values);
      setGoals([...goals, response.data]);
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleUpdate = async (id, values) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/goals/${id}`, values);
      setGoals(goals.map(goal => goal._id === id ? response.data : goal));
      setModalVisible(false);
      setEditingGoal(null);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/goals/${id}`);
      setGoals(goals.filter(goal => goal._id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleEdit = (id) => {
    const goalToEdit = goals.find(goal => goal._id === id);
    setEditingGoal(goalToEdit);
    setModalVisible(true);
  };

  const handleUpdateTask = async (id, updatedTasks) => {
    try {
      const goalToUpdate = goals.find(goal => goal._id === id);
      const response = await axios.put(`http://localhost:3000/api/goals/${id}`, 
        { ...goalToUpdate, tasks: updatedTasks }, 
        { withCredentials: true }
      );
      setGoals(goals.map(goal => goal._id === id ? response.data : goal));
    } catch (error) {
      console.error('Error updating goal tasks:', error);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingGoal(null);
  };

  return (
    <Layout className="min-h-screen bg-gradient-to-r from-pink-100 to-blue-100 inter-font">
      <Navbar />
      <Content className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Goals</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div 
              className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleAddGoal}
            >
              <PlusOutlined className="text-4xl text-gray-400" />
            </div>
            {goals.map((goal) => (
              <GoalItem
                key={goal._id}
                goal={goal}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onUpdateTask={handleUpdateTask}
              />
            ))}
          </div>
        </div>
        <GoalsModal
          visible={modalVisible}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
          initialData={editingGoal}
        />
      </Content>
    </Layout>
  );
};

export default Goals;