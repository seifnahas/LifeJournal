import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Signon = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();


  const onSubmit = async (data) => {
    try {
      if (isSignUp) {
        const response = await axios.post('http://localhost:3000/api/register', data);
        message.success(response.data.message);
        setIsSignUp(false); 
      } else {
        const response = await axios.post('http://localhost:3000/api/signin', data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        message.success('Sign in successful!');
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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </h2>
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
        {isSignUp && (
          <Form.Item
            label="Name"
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <Input {...field} prefix={<UserOutlined />} placeholder="Full Name" />
              )}
            />
          </Form.Item>
        )}
        <Form.Item
          label="Email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field }) => (
              <Input {...field} prefix={<MailOutlined />} placeholder="Email" />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field }) => (
              <Input.Password {...field} prefix={<LockOutlined />} placeholder="Password" />
            )}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </Form.Item>
      </Form>
      <Divider>Or</Divider>
      <Button
        icon={<GoogleOutlined />}
        onClick={handleGoogleSignIn}
        className="w-full mb-4"
      >
        Sign in with Google
      </Button>
      <div className="text-center">
        <span>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        </span>
        <Button type="link" onClick={toggleForm}>
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </Button>
      </div>
    </div>
  );
};

export default Signon;