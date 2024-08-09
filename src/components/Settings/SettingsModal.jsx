import React, { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SettingsModal = ({ visible, onClose, onProfilePictureUpdate, currentProfilePicture }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('profilePicture', file);
    });
    setUploading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/user/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFileList([]);
      message.success('Profile picture updated successfully');
      onProfilePictureUpdate(response.data.imageUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      message.error('Failed to update profile picture');
    }

    setUploading(false);
  };

  const props = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const handleGoToSettings = () => {
    onClose();
    navigate('/settings');
  };

  return (
    <Modal
      visible={visible}
      title="Profile Settings"
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={uploading} onClick={handleUpload}>
          Update Profile Picture
        </Button>,
      ]}
    >
      <img src={currentProfilePicture} alt="Current Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '20px' }} />
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select New Profile Picture</Button>
      </Upload>
      <Button onClick={handleGoToSettings} style={{ marginTop: '20px' }}>
        Go to Account Settings
      </Button>
    </Modal>
  );
};

export default SettingsModal;