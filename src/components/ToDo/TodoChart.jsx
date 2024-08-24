import React, {useEffect} from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import moment from 'moment';
import { setupAxiosAuth } from '../../utils/axiosConfig';

const fetchTodos = async () => {
  const { data } = await axios.get('https://lifejournalbackend.onrender.com/api/todos');
  return data;
};

const TodoChart = () => {
  const { data: todos = [], isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });



  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching todos</div>;

  // Process data for the chart
  const processedData = todos.reduce((acc, todo) => {
    const date = moment(todo.dueDate).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = { date, completed: 0, pending: 0, tags: {} };
    }
    if (todo.completed) {
      acc[date].completed += 1;
    } else {
      acc[date].pending += 1;
    }
    if (!acc[date].tags[todo.tag]) {
      acc[date].tags[todo.tag] = 0;
    }
    acc[date].tags[todo.tag] += 1;
    return acc;
  }, {});

  const chartData = Object.values(processedData).sort((a, b) => moment(a.date).diff(moment(b.date)));

  const tagColors = {
    'Urgent': '#ff4d4f',
    'High Priority': '#ffa940',
    'Work': '#1890ff',
    'Personal': '#f759ab',
    'Health & Fitness': '#52c41a',
    'Long-term': '#722ed1',
    'Shopping': '#9254de'
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">To-Do List Productivity</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" stackId="a" fill="#52c41a" name="Completed" />
          <Bar dataKey="pending" stackId="a" fill="#faad14" name="Pending" />
          {Object.keys(tagColors).map((tag) => (
            <Bar key={tag} dataKey={`tags.${tag}`} stackId="b" fill={tagColors[tag]} name={tag} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TodoChart;