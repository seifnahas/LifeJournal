import React from 'react';
import { Checkbox, Typography, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ToDoItem = ({ id, title, dueDate, completed, onDelete, onEdit, onToggleComplete }) => {
  const handleDelete = () => {
    onDelete(id);
  };

  const handleEdit = () => {
    onEdit(id);
  };

  const handleToggleComplete = (e) => {
    onToggleComplete(id, e.target.checked);
  };

  return (
    <div className="flex items-center justify-between p-2 mb-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center">
        <Checkbox checked={completed} onChange={handleToggleComplete} className="mr-2" />
        <Text 
          strong 
          className={`text-lg ${completed ? 'line-through text-gray-400' : ''}`}
        >
          {title}
        </Text>
      </div>
      <div className="flex items-center">
        <Text type="secondary" className="mr-4">
          Due: {new Date(dueDate).toLocaleDateString()}
        </Text>
        <Button 
          type="text" 
          icon={<EditOutlined />} 
          onClick={handleEdit}
          aria-label="Edit todo"
          className="mr-2"
        />
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={handleDelete}
          aria-label="Delete todo"
        />
      </div>
    </div>
  );
};

export default ToDoItem;