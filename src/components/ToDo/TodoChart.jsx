import React, { useState, useEffect } from 'react';
import { Card, Title, BarChart } from "@tremor/react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


const TodoChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetchTodoData();
  }, []);

  const handleToDoChartClick = () => {
    navigate('/todos');
  }

  const fetchTodoData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/todos', { withCredentials: true });
      console.log('Todo data fetched:', response.data);
      const todos = response.data;
      
      const pendingTodos = todos.filter(todo => !todo.completed);
      const groupedData = groupTodosByDueDate(pendingTodos);
      
      console.log('Processed data:', groupedData);
      setData(groupedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching todo data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const groupTodosByDueDate = (todos) => {
    const grouped = todos.reduce((acc, todo) => {
      const dueDate = new Date(todo.dueDate).toLocaleDateString();
      acc[dueDate] = (acc[dueDate] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      'Pending Todos': count
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  if (loading) {
    return <Card className="mt-4"><Title>Loading...</Title></Card>;
  }

  if (error) {
    return <Card className="mt-4"><Title>Error: {error}</Title></Card>;
  }

  return (
    <div onClick={handleToDoChartClick} className='cursor-pointer'>

    <Card className="mt-4">
      <Title>Pending Todos</Title>
      {data.length > 0 ? (
        <BarChart
          className="mt-6"
          data={data}
          index="date"
          categories={["Pending Todos"]}
          colors={["blue"]}
          yAxisWidth={48}
        />
      ) : (
        <Title>No pending todos</Title>
      )}
    </Card>
    </div>
  );
};

export default TodoChart;