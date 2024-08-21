import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  SmileOutlined, 
  PictureOutlined,
  CheckSquareOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import DefaultPfp from '../assets/DefaultPfp.png'; 

const { Sider } = Layout;

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const menuItems = [
    { key: "/dashboard", icon: <HomeOutlined />, label: "Home", onClick: () => navigate('/dashboard') },
    // { key: "/profile", icon: <UserOutlined />, label: "Profile", onClick: () => navigate('/profile') },
    { key: "/todos", icon: <UnorderedListOutlined />, label: "ToDos", onClick: () => navigate('/todos') },
    { key: "/mood", icon: <SmileOutlined />, label: "Mood Journal", onClick: () => navigate('/mood') },
    { key: "/photos", icon: <PictureOutlined />, label: "Photo Journal", onClick: () => navigate('/photos') },
    { key: "/goals", icon: <CheckSquareOutlined />, label: "Goals", onClick: () => navigate('/goals') },
    { key: "/settings", icon: <SettingOutlined />, label: "Settings", onClick: () => navigate('/settings') },

  ];

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={onCollapse} 
      className="bg-gray-900 min-h-screen"
      width={200}
    >
      <div className="h-16 m-4 mb-8 flex justify-center items-center">
        <img 
          src={DefaultPfp} 
          alt="Profile" 
          className="w-12 h-12 rounded-full cursor-pointer border-2 border-gray-700" 
        />
      </div>
      <Menu
        theme="dark"
        defaultSelectedKeys={[location.pathname]}
        selectedKeys={[location.pathname]}
        mode="inline"
        className="bg-gray-900 border-r-0"
        items={menuItems}
      />
    </Sider>
  );
};

export default Navbar;
