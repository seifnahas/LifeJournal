import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  SmileOutlined, 
  PictureOutlined,
  CheckSquareOutlined 
} from '@ant-design/icons';

const { Sider } = Layout;
import { Link, useNavigate } from 'react-router-dom';

import DefaultPfp from '../assets/DefaultPfp.png'; 
import SettingsModal from './Settings/SettingsModal';




const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(DefaultPfp);
  const navigate = useNavigate();

  

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const handleProfileClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleProfilePictureUpdate = (newPicture) => {
    setProfilePicture(newPicture);
    setIsModalVisible(false);
  };

  const handleToDosClick = () => {
    navigate('/todos');
  };

  const handleHomeClick = () => {
    navigate('/dashboard');
  }

  const handleMoodClick = () => {
    navigate('/mood');
  }

  const handleSettingsClick = () => {
    navigate('/settings');
  }

  const handlePhotoClick = () => {
    navigate('/photos');
  }

  const handleGoalsClick = () => {
    navigate('/goals');
  }

  return (
    <>
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} className="bg-white">
      <div className="h-8 m-4 mb-5 flex justify-center items-center">
        <img 
              src={profilePicture} 
              alt="Profile" 
              style={{ width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer' }} 
              onClick={handleProfileClick}
            />
      </div>
      <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="1" onClick={handleHomeClick} icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          Profile
        </Menu.Item>
        <Menu.Item key="3" onClick={handleSettingsClick} icon={<SettingOutlined />} >
          Settings
        </Menu.Item>
        <Menu.Item key="4" onClick={handleToDosClick} icon={<UnorderedListOutlined /> } className="mt-auto">
          ToDos
        </Menu.Item>
        <Menu.Item key="5" onClick={handleMoodClick} icon={<SmileOutlined /> } className="mt-auto">
          Mood Journal
        </Menu.Item>
        <Menu.Item key="6" onClick={handlePhotoClick} icon={<PictureOutlined /> } className="mt-auto">
          Photo Journal
        </Menu.Item>
        <Menu.Item key="7" onClick={handleGoalsClick} icon={<CheckSquareOutlined /> } className="mt-auto">
          Goals
        </Menu.Item>
      </Menu>
    </Sider>

    <SettingsModal 
        visible={isModalVisible} 
        onClose={handleModalClose} 
        onProfilePictureUpdate={handleProfilePictureUpdate}
        currentProfilePicture={profilePicture}
      />
    </>
  );
};

export default Navbar;
