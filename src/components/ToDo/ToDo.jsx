import React, { useState, useEffect } from 'react';
import { Layout, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Navbar from '../Navbar';
import ToDoModal from './ToDoModal';
import ToDoItem from './ToDoItem';
import axios from 'axios';

const { Content } = Layout;

const ToDo = () => {
  const [todos, setTodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/todos', { withCredentials: true });
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      message.error('Failed to fetch todos');
    }
  };

  const handleAddTodo = () => {
    setEditingTodo(null);
    setModalVisible(true);
  };

  const handleCreate = async (values) => {
    try {
      const response = await axios.post('http://localhost:3000/api/todos', values, { withCredentials: true });
      setTodos([...todos, response.data]);
      setModalVisible(false);
      message.success('Todo added successfully');
    } catch (error) {
      console.error('Error adding todo:', error);
      message.error('Failed to add todo');
    }
  };

  const handleUpdate = async (id, values) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/todos/${id}`, values, { withCredentials: true });
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
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
      await axios.delete(`http://localhost:3000/api/todos/${id}`, { withCredentials: true });
      setTodos(todos.filter(todo => todo._id !== id));
      message.success('Todo deleted successfully');
    } catch (error) {
      console.error('Error deleting todo:', error);
      message.error('Failed to delete todo');
    }
  };

  const handleEdit = (id) => {
    const todoToEdit = todos.find(todo => todo._id === id);
    setEditingTodo(todoToEdit);
    setModalVisible(true);
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const todoToUpdate = todos.find(todo => todo._id === id);
      const response = await axios.put(`http://localhost:3000/api/todos/${id}`, 
        { ...todoToUpdate, completed }, 
        { withCredentials: true }
      );
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
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

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Layout className="site-layout">
        <Content className="m-4 p-4 bg-white rounded-lg relative">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">ToDos</h1>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTodo}>
              Add ToDo
            </Button>
          </div>
          {todos.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-2xl font-bold text-gray-400">No ToDos!</p>
            </div>
          ) : (
            <div>
              {todos.map((todo) => (
                <ToDoItem
                  key={todo._id}
                  id={todo._id}
                  title={todo.title}
                  dueDate={todo.dueDate}
                  completed={todo.completed}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}
          <ToDoModal
            visible={modalVisible}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onCancel={handleCancel}
            initialData={editingTodo}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ToDo;