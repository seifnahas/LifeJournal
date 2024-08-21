import React, { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import Navbar from '../Navbar';
import MoodModal from './MoodModal';
import CalendarView from './CalendarView';
import { setupAxiosAuth } from '../../utils/axiosConfig';
import axios from 'axios';
import MoodItem from './MoodItem';

const { Content } = Layout;

const Mood = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [moods, setMoods] = useState([]);
  const [editingMood, setEditingMood] = useState(null);
  const [view, setView] = useState('list');

  useEffect(() => {
    setupAxiosAuth();
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/moods');
      setMoods(response.data);
    } catch (error) {
      console.error('Error fetching moods:', error);
      if (error.response && error.response.status === 401) {
        message.error('Session expired. Please log in again.');
        // navigate('/signin');
      } else {
        message.error('Failed to fetch moods');
      }
    }
  };

  const handleAddMood = () => {
    setEditingMood(null);
    setModalVisible(true);
  };

  const handleEdit = (mood) => {
    setEditingMood(mood);
    setModalVisible(true);
  };

  const handleCreate = async (values) => {
    try {
      if (editingMood) {
        const response = await axios.put(`http://localhost:3000/api/moods/${editingMood._id}`, values);
        setMoods(moods.map(mood => mood._id === editingMood._id ? response.data : mood));
        message.success('Mood updated successfully');
      } else {
        const response = await axios.post('http://localhost:3000/api/moods', values);
        setMoods([response.data, ...moods]);
        message.success('Mood logged successfully');
      }
      setModalVisible(false);
      setEditingMood(null);
    } catch (error) {
      console.error('Error saving mood:', error);
      if (error.response && error.response.status === 401) {
        message.error('Session expired. Please log in again.');
        // navigate('/signin');
      } else {
        message.error('Failed to save mood');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/moods/${id}`);
      setMoods(moods.filter(mood => mood._id !== id));
      message.success('Mood entry deleted successfully');
    } catch (error) {
      console.error('Error deleting mood:', error);
      if (error.response && error.response.status === 401) {
        message.error('Session expired. Please log in again.');
        // navigate('/signin');
      } else {
        message.error('Failed to delete mood entry');
      }
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingMood(null);
  };

  return (
    <Layout className="min-h-screen bg-gradient-to-r from-pink-100 to-blue-100 inter-font">
      <Navbar />
      <Content className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Mood Journal</h1>
          <div className="flex justify-between items-center mb-8">
            <button
              className={`px-4 py-2 rounded-lg ${view === 'list' ? 'bg-white text-gray-800' : 'bg-gray-200 text-gray-600'} hover:bg-white transition-colors`}
              onClick={() => setView('list')}
            >
              List View
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${view === 'calendar' ? 'bg-white text-gray-800' : 'bg-gray-200 text-gray-600'} hover:bg-white transition-colors`}
              onClick={() => setView('calendar')}
            >
              Calendar View
            </button>
            <button
              className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={handleAddMood}
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="ml-2 text-gray-600">Log Mood</span>
            </button>
          </div>
          {view === 'list' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {moods.map((mood) => (
                <MoodItem
                  key={mood._id}
                  mood={mood}
                  onEdit={() => handleEdit(mood)}
                  onDelete={() => handleDelete(mood._id)}
                />
              ))}
            </div>
          ) : (
            <CalendarView moods={moods} />
          )}
        </div>
        <MoodModal
          visible={modalVisible}
          onCreate={handleCreate}
          onCancel={handleCancel}
          initialValues={editingMood}
        />
      </Content>
    </Layout>
  );
};

export default Mood;