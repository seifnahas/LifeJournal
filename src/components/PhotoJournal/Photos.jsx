import React, { useState, useEffect } from 'react';
import { Layout, Button, List, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Navbar from '../Navbar';
import PhotosModal from './PhotosModal';
import PhotoItem from './PhotoItem';
import axios from 'axios';

const { Content } = Layout;

const Photos = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [editingPhoto, setEditingPhoto] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/photos');
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
      message.error('Failed to fetch photos');
    }
  };

  const showModal = (photo = null) => {
    setEditingPhoto(photo);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingPhoto(null);
  };

  const handleSubmit = async (formData, id = null) => {
    try {
      let response;
      if (id) {
        response = await axios.put(`http://localhost:3000/api/photos/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setPhotos(photos.map(photo => photo._id === id ? response.data : photo));
        message.success('Photo updated successfully');
      } else {
        response = await axios.post('http://localhost:3000/api/photos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setPhotos([response.data, ...photos]);
        message.success('Photo added successfully');
      }
      setModalVisible(false);
      setEditingPhoto(null);
    } catch (error) {
      console.error('Error submitting photo:', error);
      message.error('Failed to submit photo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/photos/${id}`);
      setPhotos(photos.filter(photo => photo._id !== id));
      message.success('Photo deleted successfully');
    } catch (error) {
      console.error('Error deleting photo:', error);
      message.error('Failed to delete photo');
    }
  };

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Layout className="site-layout">
        <Content className="m-4 p-4 bg-white rounded-lg relative">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Photo Journal</h1>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
              Add Entry
            </Button>
          </div>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
            dataSource={photos}
            renderItem={(photo) => (
              <List.Item>
                <PhotoItem 
                  photo={photo} 
                  onEdit={() => showModal(photo)}
                  onDelete={() => handleDelete(photo._id)}
                />
              </List.Item>
            )}
          />
          <PhotosModal
            visible={modalVisible}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={editingPhoto}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Photos;