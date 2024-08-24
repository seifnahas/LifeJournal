import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const MoodChart = () => {
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await axios.get('https://lifejournalbackend.onrender.com/api/moods');
        const formattedData = response.data.map(entry => ({
          date: new Date(entry.date).toLocaleDateString(),
          mood: ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'].indexOf(entry.mood) + 1,
        }));
        setMoodData(formattedData);
      } catch (error) {
        console.error('Error fetching mood data:', error);
      }
    };

    fetchMoodData();
  }, []);

  return (
    <Card title="Mood Tracking" className="mb-4">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={moodData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
          <Tooltip />
          <Line type="monotone" dataKey="mood" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MoodChart;