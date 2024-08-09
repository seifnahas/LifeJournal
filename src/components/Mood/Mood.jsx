import React, { useState, useEffect } from 'react';
import { Layout, Button, message, Row, Col, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Navbar from '../Navbar';
import MoodModal from './MoodModal';
import CalendarView from './CalendarView';

import axios from 'axios';
import MoodItem from './MoodItem';

const { Content } = Layout;

const Mood = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [moods, setMoods] = useState([]);
  const [editingMood, setEditingMood] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'calendar'

  useEffect(() => {
    fetchMoods();
  }, []);


  


  
  const fetchMoods = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/moods', { withCredentials: true });
      setMoods(response.data);
    } catch (error) {
      console.error('Error fetching moods:', error);
      message.error('Failed to fetch moods');
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

  const renderContent = () => {
    if (view === 'calendar') {
      return <CalendarView moods={moods} />;
    }

    return (
      <Row gutter={[16, 16]}>
        {moods.map((mood) => (
          <Col xs={24} sm={12} md={8} lg={6} key={mood._id}>
            <MoodItem 
              mood={mood} 
              onDelete={() => handleDelete(mood._id)}
              onEdit={() => handleEdit(mood)}
            />
          </Col>
        ))}
      </Row>
    );
  };


  const handleCreate = async (values) => {
    try {
      if (editingMood) {
        const response = await axios.put(`http://localhost:3000/api/moods/${editingMood._id}`, values, { withCredentials: true });
        setMoods(moods.map(mood => mood._id === editingMood._id ? response.data : mood));
        message.success('Mood updated successfully');
      } else {
        const response = await axios.post('http://localhost:3000/api/moods', values, { withCredentials: true });
        setMoods([response.data, ...moods]);
        message.success('Mood logged successfully');
      }
      setModalVisible(false);
      setEditingMood(null);
    } catch (error) {
      console.error('Error saving mood:', error);
      message.error('Failed to save mood');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/moods/${id}`, { withCredentials: true });
      setMoods(moods.filter(mood => mood._id !== id));
      message.success('Mood entry deleted successfully');
    } catch (error) {
      console.error('Error deleting mood:', error);
      message.error('Failed to delete mood entry');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingMood(null);
  };

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Layout className="site-layout">
        <Content className="m-4 p-4 bg-white rounded-lg relative">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Your Mood Journal</h1>
            <div>
              <Radio.Group value={view} onChange={(e) => setView(e.target.value)} className="mr-4">
                <Radio.Button value="list">List</Radio.Button>
                <Radio.Button value="calendar">Calendar</Radio.Button>
              </Radio.Group>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMood}>
                Log Mood
              </Button>
            </div>
          </div>
          {moods.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-2xl font-bold text-gray-400">No Moods Logged!</p>
            </div>
          ) : renderContent()}
          <MoodModal
            visible={modalVisible}
            onCreate={handleCreate}
            onCancel={handleCancel}
            initialValues={editingMood}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Mood;