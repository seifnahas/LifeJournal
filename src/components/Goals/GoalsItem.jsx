import React, { useState } from 'react';
import { Progress, Button } from 'antd';

const GoalItem = ({ goal, onDelete, onEdit, onUpdateTask, onToggleComplete }) => {
  const [isCompleted, setIsCompleted] = useState(goal.completed);

  const completedTasks = goal.tasks.filter(task => task.completed).length;
  const progress = goal.tasks.length > 0 
    ? (completedTasks / goal.tasks.length) * 100 
    : (isCompleted ? 100 : 0);

  const handleTaskToggle = (taskIndex, checked) => {
    const updatedTasks = [...goal.tasks];
    updatedTasks[taskIndex].completed = checked;
    onUpdateTask(goal._id, updatedTasks);
  };

  const handleToggleComplete = () => {
    const newCompletionStatus = !isCompleted;
    setIsCompleted(newCompletionStatus);
    onToggleComplete(goal._id, newCompletionStatus);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden inter-font flex flex-col h-full">
      <div className="p-4 flex-grow">
        <div className="mb-4 flex justify-center">
          <Progress
            type="circle"
            percent={Math.round(progress)}
            width={80}
            strokeColor={{
              '0%': '#ffecd2',
              '100%': '#fcb69f',
            }}
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{goal.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
        <p className="text-xs text-gray-500 mb-4">Due: {new Date(goal.dueDate).toLocaleDateString()}</p>
        {goal.tasks.length > 0 ? (
          <div className="space-y-2">
            {goal.tasks.map((task, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => handleTaskToggle(index, e.target.checked)}
                  className="mr-2"
                />
                <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {task.description}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <Button 
            onClick={handleToggleComplete}
            type="primary"
            className="w-full"
          >
            {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
          </Button>
        )}
      </div>
      <div className="flex border-t border-gray-200 mt-auto">
        <button onClick={() => onEdit(goal._id)} className="flex-1 py-2 text-sm text-center text-gray-500 hover:bg-gray-50">Edit</button>
        <button onClick={() => onDelete(goal._id)} className="flex-1 py-2 text-sm text-center text-gray-500 hover:bg-gray-50 border-l border-gray-200">Delete</button>
      </div>
    </div>
  );
};

export default GoalItem;