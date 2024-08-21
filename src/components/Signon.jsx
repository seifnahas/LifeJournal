import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, MailOutlined } from '@ant-design/icons';
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
        const response = await axios.post('http://localhost:3000/api/auth/register', data);
        message.success(response.data.message);
        setIsSignUp(false); 
      } else {
        const response = await axios.post('http://localhost:3000/api/auth/signin', data);
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

  const handleGoogleSignIn = () => {
    console.log('Sign in with Google');
    message.info('Google sign-in not implemented');
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden mx-4 max-w-4xl w-full">
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h2>
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
              <Button type="primary" htmlType="submit" className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </Form.Item>
            <Divider>Or</Divider>
            <Button onClick={handleGoogleSignIn} icon={<GoogleOutlined />} className="w-full text-black border">
              Sign in with Google
            </Button>
            <div className="flex justify-between items-center mt-4">
              <Button type="link" onClick={toggleForm}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Button>
              <Button type="link">
                Forgot your password?
              </Button>
            </div>
          </Form>
        </div>
        <div className="hidden md:block md:w-1/2 bg-cover" style={{ backgroundImage: 'url(/path-to-your-abstract-pattern.png)' }}></div>
      </div>
    </div>
  );
};

export default Signon;