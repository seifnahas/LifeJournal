import React, { useState, useEffect } from 'react';
import { Layout, Spin, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '../Navbar';
import PhotosModal from './PhotosModal';
import PhotoItem from './PhotoItem';
import axios from 'axios';
import { setupAxiosAuth } from '../../utils/axiosConfig';

const { Content } = Layout;

const fetchPhotos = async () => {
  const { data } = await axios.get('https://lifejournalbackend.onrender.com/api/photos');
  return data;
};

const Photos = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setupAxiosAuth();
  }, []);

  const { data: photos = [], isLoading, error } = useQuery({
    queryKey: ['photos'],
    queryFn: fetchPhotos,
  });

  const createPhotoMutation = useMutation({
    mutationFn: (newPhoto) => axios.post('https://lifejournalbackend.onrender.com/api/photos', newPhoto, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries('photos');
      setModalVisible(false);
    },
    onError: (error) => {
      console.error('Error adding photo:', error);
      message.error('Failed to add photo. Please try again.');
    },
  });

  const updatePhotoMutation = useMutation({
    mutationFn: ({ id, formData }) => axios.put(`https://lifejournalbackend.onrender.com/api/photos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['photos'], (oldData) => {
        return oldData.map((photo) => 
          photo._id === variables.id ? { ...photo, ...data.data } : photo
        );
      });
      setModalVisible(false);
      setEditingPhoto(null);
    },
    onError: (error) => {
      console.error('Error updating photo:', error);
      message.error('Failed to update photo. Please try again.');
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: (id) => axios.delete(`https://lifejournalbackend.onrender.com/api/photos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries('photos');
    },
    onError: (error) => {
      console.error('Error deleting photo:', error);
      message.error('Failed to delete photo. Please try again.');
    },
  });

  if (isLoading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
  }

  if (error) {
    message.error('Failed to fetch photos. Please try again later.');
  }

  const showModal = (photo = null) => {
    setEditingPhoto(photo);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingPhoto(null);
  };

  const handleSubmit = (formData, id = null) => {
    if (id) {
      updatePhotoMutation.mutate({ id, formData });
    } else {
      createPhotoMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    deletePhotoMutation.mutate(id);
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
