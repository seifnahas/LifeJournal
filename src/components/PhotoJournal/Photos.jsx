import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Navbar from '../Navbar';
import PhotosModal from './PhotosModal';
import PhotoItem from './PhotoItem';
import axios from 'axios';
import { setupAxiosAuth } from '../../utils/axiosConfig';


const { Content } = Layout;

const Photos = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [editingPhoto, setEditingPhoto] = useState(null);

  useEffect(() => {
    setupAxiosAuth();
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/photos');
      setPhotos(response.data);
    } catch (error) { 
      console.error('Error fetching photos:', error);
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
      } else {
        response = await axios.post('http://localhost:3000/api/photos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setPhotos([response.data, ...photos]);
      }
      setModalVisible(false);
      setEditingPhoto(null);
    } catch (error) {
      console.error('Error submitting photo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/photos/${id}`);
      setPhotos(photos.filter(photo => photo._id !== id));
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  return (
    <Layout className="min-h-screen bg-gradient-to-r from-pink-100 to-blue-100 inter-font">
      <Navbar />
      <Content className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Photo Journal</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div 
              className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => showModal()}
            >
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            {photos.map((photo) => (
              <PhotoItem 
                key={photo._id}
                photo={photo} 
                onEdit={() => showModal(photo)}
                onDelete={() => handleDelete(photo._id)}
              />
            ))}
          </div>
        </div>
        <PhotosModal
          visible={modalVisible}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={editingPhoto}
        />
      </Content>
    </Layout>
  );
};

export default Photos;