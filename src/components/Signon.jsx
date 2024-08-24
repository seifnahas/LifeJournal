import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setupAxiosAuth } from '../utils/axiosConfig';

const Signon = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      if (isSignUp) {
        const response = await axios.post('https://life-journal-backend.vercel.app/api/auth/register', data);
        message.success(response.data.message);
        setIsSignUp(false);
      } else {
        const response = await axios.post('https://life-journal-backend.vercel.app/api/auth/signin', data);
        const { token } = response.data;
        localStorage.setItem('jwtToken', token);
        message.success('Sign in successful!');
        setupAxiosAuth();
        navigate('/dashboard');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-blue-100 inter-font">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h1>
        <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
          {isSignUp && (
            <Form.Item
              label="Name"
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name ? errors.name.message : ''}
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} prefix={<UserOutlined />} placeholder="Enter your name" />}
                rules={{ required: 'Name is required' }}
              />
            </Form.Item>
          )}
          <Form.Item
            label="Email"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email ? errors.email.message : ''}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} prefix={<MailOutlined />} placeholder="Enter your email" />}
              rules={{ required: 'Email is required' }}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password ? errors.password.message : ''}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => <Input.Password {...field} prefix={<LockOutlined />} placeholder="Enter your password" />}
              rules={{ required: 'Password is required' }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </Form.Item>
          <div className="text-center mt-4">
            <Button type="link" onClick={toggleForm} className="text-gray-600 hover:text-gray-800">
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Signon;