import React from 'react';

const MoodItem = ({ mood, onEdit, onDelete }) => {
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

  const getMoodColor = (moodString) => {
    switch (moodString.toLowerCase()) {
      case 'very sad': return 'bg-red-100';
      case 'sad': return 'bg-orange-100';
      case 'neutral': return 'bg-yellow-100';
      case 'happy': return 'bg-green-100';
      case 'very happy': return 'bg-blue-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden inter-font">
      <div className={`relative aspect-w-1 aspect-h-1 ${getMoodColor(mood.mood)} flex items-center justify-center`}>
        <span className="text-6xl" role="img" aria-label={mood.mood}>
          {getMoodEmoji(mood.mood)}
        </span>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <p className="text-white text-sm font-medium">{new Date(mood.date).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-800 text-lg font-semibold mb-2">{mood.mood}</p>
        <p className="text-gray-600 text-sm mb-2">Intensity: {mood.intensity}</p>
        {mood.notes && (
          <p className="text-gray-600 text-sm italic">"{mood.notes}"</p>
        )}
      </div>
      <div className="flex border-t border-gray-200">
        <button onClick={onEdit} className="flex-1 py-2 text-sm text-center text-gray-500 hover:bg-gray-50">Edit</button>
        <button onClick={onDelete} className="flex-1 py-2 text-sm text-center text-gray-500 hover:bg-gray-50 border-l border-gray-200">Delete</button>
      </div>
    </div>
  );
};

export default MoodItem;