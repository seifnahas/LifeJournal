import React, { useState } from 'react';
import { Layout, Button, message, Select, Radio, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../Navbar';
import ToDoModal from './ToDoModal';
import ToDoItem from './ToDoItem';
import CalendarViewToDo from './CalendarViewToDo';
import axios from 'axios';
import { setupAxiosAuth } from '../../utils/axiosConfig';

const { Content } = Layout;
const { Option } = Select;

const fetchTodos = async () => {
  const { data } = await axios.get('http://localhost:3000/api/todos');
  return data;
};

const ToDo = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [selectedTag, setSelectedTag] = useState('All');
  const [view, setView] = useState('list');

  setupAxiosAuth();

  const { data: todos = [], isLoading, error, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const handleAddTodo = () => {
    setEditingTodo(null);
    setModalVisible(true);
  };

  const handleCreate = async (values) => {
    try {
      const response = await axios.post('http://localhost:3000/api/todos', values);
      refetch();
      setModalVisible(false);
      message.success('Todo added successfully');
    } catch (error) {
      console.error('Error adding todo:', error);
      message.error('Failed to add todo');
    }
  };



  const handleUpdate = async (id, values) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/todos/${id}`, values);
      refetch();
      setModalVisible(false);
      setEditingTodo(null);
      message.success('Todo updated successfully');
    } catch (error) {
      console.error('Error updating todo:', error);
      message.error('Failed to update todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/todos/${id}`);
      refetch();
      message.success('Todo deleted successfully');
    } catch (error) {
      console.error('Error deleting todo:', error);
      message.error('Failed to delete todo');
    }
  };

  const handleEdit = (id) => {
    const todoToEdit = todos.find((todo) => todo._id === id);
    setEditingTodo(todoToEdit);
    setModalVisible(true);
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const todoToUpdate = todos.find((todo) => todo._id === id);
      const response = await axios.put(
        `http://localhost:3000/api/todos/${id}`,
        { ...todoToUpdate, completed },
        { withCredentials: true }
      );
      refetch();
      message.success('Todo status updated successfully');
    } catch (error) {
      console.error('Error updating todo status:', error);
      message.error('Failed to update todo status');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingTodo(null);
  };

  const handleTagChange = (value) => {
    setSelectedTag(value);
  };

  const filteredTodos = selectedTag === 'All' ? todos : todos.filter(todo => todo.tag === selectedTag);

  if (isLoading) {
    return (
      <Layout style={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" tip="Loading your tasks..." />
      </Layout>
    );
  }



  const renderContent = () => {
    if (view === 'calendar') {
      return <CalendarViewToDo todos={filteredTodos} />;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div 
          className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleAddTodo}
        >
          <PlusOutlined className="text-4xl text-gray-400" />
        </div>
        {filteredTodos.map((todo) => (
          <ToDoItem
            key={todo._id}
            id={todo._id}
            title={todo.title}
            dueDate={todo.dueDate}
            completed={todo.completed}
            tag={todo.tag}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </div>
    );
  };

   return (
    <Layout className="min-h-screen bg-gradient-to-r from-pink-100 to-blue-100 inter-font">
      <Navbar />
      <Content className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Todo List</h1>
          <div className="mb-8 flex justify-end space-x-4">
            <Select
              style={{ width: 200 }}
              placeholder="Filter by tag"
              onChange={handleTagChange}
              value={selectedTag}
              className="bg-white rounded-lg shadow-sm"
            >
              <Option value="All">All</Option>
              <Option value="Urgent">Urgent</Option>
              <Option value="High Priority">High Priority</Option>
              <Option value="Work">Work</Option>
              <Option value="Personal">Personal</Option>
              <Option value="Health & Fitness">Health & Fitness</Option>
              <Option value="Long-term">Long-term</Option>
              <Option value="Shopping">Shopping</Option>
            </Select>
            <Radio.Group 
              value={view} 
              onChange={(e) => setView(e.target.value)}
              className="bg-white rounded-lg shadow-sm p-1"
            >
              <Radio.Button value="list" className="rounded-l-md">List</Radio.Button>
              <Radio.Button value="calendar" className="rounded-r-md">Calendar</Radio.Button>
            </Radio.Group>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-2xl font-bold text-gray-400">Loading todos...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-2xl font-bold text-red-500">Error fetching todos</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-2xl font-bold text-gray-400">No ToDos!</p>
            </div>
          ) : (
            renderContent()
          )}
          <ToDoModal
            visible={modalVisible}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onCancel={handleCancel}
            initialData={editingTodo}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default ToDo;