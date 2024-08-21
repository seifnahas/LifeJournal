import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, message, Row, Col, Avatar, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Navbar from '../Navbar';
import axios from 'axios';
import { setupAxiosAuth } from '../../utils/axiosConfig';

const { Content } = Layout;

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setupAxiosAuth();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      message.error('Failed to fetch user data');
    }
  };

  const onFinishName = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put('http://localhost:3000/api/user/name', {
        name: values.name,
      });
      setUser(response.data);
      message.success('Name updated successfully');
    } catch (error) {
      console.error('Error updating name:', error);
      message.error('Failed to update name');
    }
    setLoading(false);
  };

  const onFinishEmail = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put('http://localhost:3000/api/user/email', {
        email: values.email,
      });
      setUser(response.data);
      message.success('Email updated successfully');
    } catch (error) {
      console.error('Error updating email:', error);
      message.error('Failed to update email');
    }
    setLoading(false);
  };

  const onFinishPassword = async (values) => {
    setLoading(true);
    try {
      await axios.put('http://localhost:3000/api/user/password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      message.error('Failed to update password');
    }
    setLoading(false);
  };

  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await axios.post('http://localhost:3000/api/user/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(response.data.user);
      message.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      message.error('Failed to upload profile picture');
    }
  };

  return (
    <Layout className="min-h-screen bg-gradient-to-r from-pink-100 to-blue-100">
      <Navbar />
      <Layout className="site-layout">
        <Content className="m-4 p-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Account Settings</h1>
          {user && (
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card className="shadow-md rounded-lg">
                  <div className="flex items-center mb-4">
                    <Avatar size={64} icon={<UserOutlined />} src={user.profilePicture} />
                    <div className="ml-4">
                      <h2 className="text-xl font-semibold">Profile Picture</h2>
                      <p className="text-sm text-gray-500">PNG, JPEG under 15MB</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    className="hidden"
                    id="profile-pic-upload"
                  />
                  <label htmlFor="profile-pic-upload" className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
                    Upload new picture
                  </label>
                </Card>
              </Col>
              
              <Col xs={24} md={12}>
                <Card className="shadow-md rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Name</h2>
                  <Form
                    initialValues={{ name: user.name }}
                    onFinish={onFinishName}
                    layout="vertical"
                  >
                    <Form.Item
                      name="name"
                      rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                      <Input className="rounded-md" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-500 hover:bg-blue-600">
                        Save Name
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              
              <Col xs={24} md={12}>
                <Card className="shadow-md rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Email</h2>
                  <Form
                    initialValues={{ email: user.email }}
                    onFinish={onFinishEmail}
                    layout="vertical"
                  >
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                      ]}
                    >
                      <Input className="rounded-md" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-500 hover:bg-blue-600">
                        Save Email
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              
              <Col xs={24} md={12}>
                <Card className="shadow-md rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Password</h2>
                  <Form onFinish={onFinishPassword} layout="vertical">
                    <Form.Item
                      name="currentPassword"
                      label="Current password"
                      rules={[{ required: true, message: 'Please input your current password!' }]}
                    >
                      <Input.Password className="rounded-md" />
                    </Form.Item>
                    <Form.Item
                      name="newPassword"
                      label="New password"
                      rules={[{ required: true, message: 'Please input your new password!' }]}
                    >
                      <Input.Password className="rounded-md" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-500 hover:bg-blue-600">
                        Change Password
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Settings;