import React, { useState } from 'react';
import { Calendar, Badge, Modal } from 'antd';
import ToDoItem from './ToDoItem';

const CalendarViewToDo = ({ todos }) => {
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const dateCellRender = (value) => {
    const date = value.format('YYYY-MM-DD');
    const todosForDate = todos.filter(
      (todo) => todo.dueDate.slice(0, 10) === date
    );

    return (
      <ul className="events">
        {todosForDate.map((todo) => (
          <li key={todo._id} className="mb-1">
            <Badge
              color={getTagColor(todo.tag)}
              text={
                <span 
                  className="cursor-pointer text-sm hover:text-blue-500 transition-colors"
                  onClick={() => showTodoDetails(todo)}
                >
                  {todo.title}
                </span>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  const getTagColor = (tag) => {
    const tagColors = {
      'Urgent': '#ff4d4f',
      'High Priority': '#ffa940',
      'Work': '#1890ff',
      'Personal': '#f759ab',
      'Health & Fitness': '#52c41a',
      'Long-term': '#eb2f96',
      'Shopping': '#722ed1',
    };
    return tagColors[tag] || '#d9d9d9';
  };

  const showTodoDetails = (todo) => {
    setSelectedTodo(todo);
    setModalVisible(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Calendar 
        dateCellRender={dateCellRender} 
        className="custom-calendar" 
      />
      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={400}
        className="custom-modal"
      >
        {selectedTodo && (
          <ToDoItem
            id={selectedTodo._id}
            title={selectedTodo.title}
            dueDate={selectedTodo.dueDate}
            completed={selectedTodo.completed}
            tag={selectedTodo.tag}
            onDelete={() => {}}
            onEdit={() => {}}
            onToggleComplete={() => {}}
          />
        )}
      </Modal>
    </div>
  );
};

export default CalendarViewToDo;