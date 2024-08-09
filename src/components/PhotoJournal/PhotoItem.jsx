import React, { useState } from 'react';
import { Card, Typography, Button } from 'antd';
import { PlayCircleFilled, PauseCircleFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const PhotoItem = ({ photo, onEdit, onDelete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  const togglePlayPreview = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(photo.previewUrl);
      newAudio.play();
      setAudio(newAudio);
      setIsPlaying(true);
    }
  };

  return (
    <Card
      className="w-full max-w-sm mx-auto bg-gray-100 rounded-lg overflow-hidden shadow-md"
      bodyStyle={{ padding: 0 }}
      actions={[
        <EditOutlined key="edit" onClick={onEdit} />,
        <DeleteOutlined key="delete" onClick={onDelete} />,
      ]}
    >
      <div className="p-4">
        <Text strong className="text-lg">{new Date(photo.date).toLocaleDateString()}</Text>
      </div>
      <div className="aspect-w-1 aspect-h-1">
        <img
          alt={photo.description || 'Photo'}
          src={photo.imageUrl}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        {photo.songName && (
          <div className="flex items-center mb-2">
            <img src={photo.albumCover} alt="Album cover" className="w-10 h-10 mr-2 rounded" />
            <div className="flex-grow">
              <Text strong className="block">{photo.songName}</Text>
              <Text type="secondary">{photo.artistName}</Text>
            </div>
            <Button
              type="text"
              icon={isPlaying ? <PauseCircleFilled className="text-blue-500" /> : <PlayCircleFilled className="text-blue-500" />}
              onClick={togglePlayPreview}
              disabled={!photo.previewUrl}
            />
          </div>
        )}
        <Text className="block">{photo.description || 'No description'}</Text>
      </div>
    </Card>
  );
};

export default PhotoItem;