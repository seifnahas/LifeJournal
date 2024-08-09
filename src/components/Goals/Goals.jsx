import React, { useState, useEffect } from 'react';
import { Layout, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Navbar from '../Navbar';
import GoalsModal from './GoalsModal';
import GoalsItem from './GoalsItem';
import axios from 'axios';

const { Content } = Layout;

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/goals', { withCredentials: true });
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      message.error('Failed to fetch goals');
    }
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
    setModalVisible(true);
  };

  const handleCreate = async (values) => {
    try {
      const response = await axios.post('http://localhost:3000/api/goals', values, { withCredentials: true });
      setGoals([...goals, response.data]);
      setModalVisible(false);
      message.success('Goal added successfully');
    } catch (error) {
      console.error('Error adding goal:', error);
      message.error('Failed to add goal');
    }
  };

  const handleUpdate = async (id, values) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/goals/${id}`, values, { withCredentials: true });
      setGoals(goals.map(goal => goal._id === id ? response.data : goal));
      setModalVisible(false);
      setEditingGoal(null);
      message.success('Goal updated successfully');
    } catch (error) {
      console.error('Error updating goal:', error);
      message.error('Failed to update goal');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/goals/${id}`, { withCredentials: true });
      setGoals(goals.filter(goal => goal._id !== id));
      message.success('Goal deleted successfully');
    } catch (error) {
      console.error('Error deleting goal:', error);
      message.error('Failed to delete goal');
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
      message.success('Goal tasks updated successfully');
    } catch (error) {
      console.error('Error updating goal tasks:', error);
      message.error('Failed to update goal tasks');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingGoal(null);
  };

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Layout className="site-layout">
        <Content className="m-4 p-4 bg-white rounded-lg relative">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Goals</h1>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddGoal}>
              Add Goal
            </Button>
          </div>
          {goals.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-2xl font-bold text-gray-400">No Goals!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map((goal) => (
                <GoalsItem
                  key={goal._id}
                  id={goal._id}
                  title={goal.title}
                  description={goal.description}
                  dueDate={goal.dueDate}
                  tasks={goal.tasks}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onUpdateTask={handleUpdateTask}
                />
              ))}
            </div>
          )}
          <GoalsModal
            visible={modalVisible}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onCancel={handleCancel}
            initialData={editingGoal}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Goals;