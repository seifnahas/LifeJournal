import React, { useState, useEffect } from 'react';
import { Layout, Spin, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusOutlined } from '@ant-design/icons';
import Navbar from '../Navbar';
import GoalsModal from './GoalsModal';
import GoalItem from './GoalsItem';
import axios from 'axios';
import { setupAxiosAuth } from '../../utils/axiosConfig';

const { Content } = Layout;

const fetchGoals = async () => {
  const { data } = await axios.get('https://lifejournalbackend.onrender.com/api/goals', { withCredentials: true });
  return data;
};

const Goals = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setupAxiosAuth();
  }, []);

  const { data: goals = [], isLoading, error, refetch } = useQuery({
    queryKey: ['goals'],
    queryFn: fetchGoals,
  });

  const createGoalMutation = useMutation({
    mutationFn: (newGoal) => axios.post('https://lifejournalbackend.onrender.com/api/goals', newGoal),
    onSuccess: () => {
      queryClient.invalidateQueries('goals');
      setModalVisible(false);
    },
    onError: (error) => {
      console.error('Error adding goal:', error);
      message.error('Failed to add goal. Please try again.');
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, values }) => axios.put(`https://lifejournalbackend.onrender.com/api/goals/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries('goals');
      setModalVisible(false);
      setEditingGoal(null);
    },
    onError: (error) => {
      console.error('Error updating goal:', error);
      message.error('Failed to update goal. Please try again.');
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (id) => axios.delete(`https://lifejournalbackend.onrender.com/api/goals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries('goals');
    },
    onError: (error) => {
      console.error('Error deleting goal:', error);
      message.error('Failed to delete goal. Please try again.');
    },
  });

  if (isLoading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
  }

  if (error) {
    message.error('Failed to fetch goals. Please try again later.');
  }

  const handleAddGoal = () => {
    setEditingGoal(null);
    setModalVisible(true);
  };

  const handleCreate = async (values) => {
    createGoalMutation.mutate(values);
  };

  const handleUpdate = async (id, values) => {
    updateGoalMutation.mutate({ id, values });
  };

  const handleDelete = async (id) => {
    deleteGoalMutation.mutate(id);
  };

  const handleEdit = (id) => {
    const goalToEdit = goals.find(goal => goal._id === id);
    setEditingGoal(goalToEdit);
    setModalVisible(true);
  };

  const handleUpdateTask = async (id, updatedTasks) => {
    const goalToUpdate = goals.find(goal => goal._id === id);
    updateGoalMutation.mutate({ id, values: { ...goalToUpdate, tasks: updatedTasks } });
  };

  const handleToggleComplete = async (id, completed) => {
    const goalToUpdate = goals.find(goal => goal._id === id);
    updateGoalMutation.mutate({ id, values: { ...goalToUpdate, completed } });
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
                onToggleComplete={handleToggleComplete}
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