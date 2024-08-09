import React from 'react';
import { Card, Button, Progress, Checkbox, List } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const GoalsItem = ({ id, title, description, dueDate, tasks, onDelete, onEdit, onUpdateTask }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const handleTaskToggle = (taskIndex, checked) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].completed = checked;
    onUpdateTask(id, updatedTasks);
  };

  return (
    <Card
      className="mb-4 shadow-md"
      title={<span className="text-lg font-bold">{title}</span>}
      extra={
        <div>
          <Button icon={<EditOutlined />} onClick={() => onEdit(id)} className="mr-2" />
          <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(id)} />
        </div>
      }
    >
      <p className="mb-2">{description}</p>
      <p className="mb-2">Due: {new Date(dueDate).toLocaleDateString()}</p>
      <Progress percent={Math.round(progress)} status="active" className="mb-4" />
      <List
        size="small"
        header={<div className="font-bold">Tasks</div>}
        dataSource={tasks}
        renderItem={(task, index) => (
          <List.Item>
            <Checkbox
              checked={task.completed}
              onChange={(e) => handleTaskToggle(index, e.target.checked)}
            >
              {task.description}
            </Checkbox>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default GoalsItem;