import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import axios from 'axios';

const GoalProgressChart = () => {
  const [goalData, setGoalData] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    const fetchGoalData = async () => {
      try {
        const response = await axios.get('https://lifejournalbackend.onrender.com/api/goals', { withCredentials: true });
        const goals = response.data;
        const completedGoals = goals.filter(goal => 
          goal.tasks.length > 0 && goal.tasks.every(task => task.completed)
        ).length;
        setGoalData({ completed: completedGoals, total: goals.length });
      } catch (error) {
        console.error('Error fetching goal data:', error);
      }
    };

    fetchGoalData();
  }, []);

  const data = [
    { name: 'Completed', value: goalData.completed },
    { name: 'Remaining', value: goalData.total - goalData.completed },
  ];

  const COLORS = ['#00C49F', '#FFBB28'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Goal Completion Progress</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-4">
        <p className="text-lg font-semibold">{`${goalData.completed} out of ${goalData.total} goals completed`}</p>
        <p className="text-sm text-gray-600">{`${Math.round((goalData.completed / goalData.total) * 100)}% completion rate`}</p>
      </div>
    </div>
  );
};

export default GoalProgressChart;