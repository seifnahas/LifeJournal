import React from 'react';
import { Card, Typography, Slider, Button, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Text } = Typography;

const MoodItem = ({ mood, onDelete, onEdit, mini = false }) => {
  const getMoodEmoji = (moodString) => {
    switch (moodString.toLowerCase()) {
      case 'very sad': return '😢';
      case 'sad': return '😟';
      case 'neutral': return '😐';
      case 'happy': return '😊';
      case 'very happy': return '😁';
      default: return '😐';
    }
  };

  if (mini) {
    return (
      <div className="flex items-center">
        <span className="text-lg mr-2" role="img" aria-label={mood.mood}>{getMoodEmoji(mood.mood)}</span>
        <Text strong>{mood.mood}</Text>
      </div>
    );
  }

  return (
    <Card 
      size="small" 
      className="w-full bg-white shadow-md rounded-lg overflow-hidden"
      actions={[
        <Tooltip title="Edit">
          <EditOutlined key="edit" onClick={onEdit} />
        </Tooltip>,
        <Tooltip title="Delete">
          <DeleteOutlined key="delete" onClick={onDelete} />
        </Tooltip>,
      ]}
    >
      <div className="p-2">
        <div className="flex justify-between items-center mb-2">
          <Text strong>{new Date(mood.date).toLocaleDateString()}</Text>
          <span className="text-2xl" role="img" aria-label={mood.mood}>{getMoodEmoji(mood.mood)}</span>
        </div>
        <Text className="block mb-2">{mood.mood}</Text>
        <div className="mb-2">
          <Text strong className="mr-2">Intensity:</Text>
          <Slider 
            disabled 
            value={mood.intensity} 
            min={1} 
            max={5}
            marks={{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' }}
          />
        </div>
        {mood.notes && (
          <div className="bg-gray-100 p-2 rounded">
            <Text strong>Notes:</Text>
            <Text className="block mt-1 text-sm">{mood.notes}</Text>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MoodItem;