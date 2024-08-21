import React from 'react';
import { Checkbox, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const tagColors = {
  'Urgent': 'red',
  'High Priority': 'orange',
  'Work': 'blue',
  'Personal': 'pink',
  'Health & Fitness': 'green',
  'Long-term': 'magenta',
  'Shopping': 'purple',
};

const ToDoItem = ({ id, title, dueDate, completed, tag, onDelete, onEdit, onToggleComplete }) => {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden inter-font">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Checkbox checked={completed} onChange={handleToggleComplete} className="mr-2" />
          <Tag color={tagColors[tag]} className="ml-auto">
            {tag}
          </Tag>
        </div>
        <h3 className={`text-lg font-medium mb-2 ${completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Due: {new Date(dueDate).toLocaleDateString()}
        </p>
      </div>
      <div className="flex border-t border-gray-200">
        <button onClick={handleEdit} className="flex-1 py-2 text-sm text-center text-gray-500 hover:bg-gray-50">
          <EditOutlined className="mr-1" />
          Edit
        </button>
        <button onClick={handleDelete} className="flex-1 py-2 text-sm text-center text-gray-500 hover:bg-gray-50 border-l border-gray-200">
          <DeleteOutlined className="mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ToDoItem;