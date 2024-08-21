import React, { useState } from 'react';

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden inter-font">
      <div className="relative aspect-w-1 aspect-h-1">
        <img
          src={photo.images[0].imageUrl}
          alt={photo.images[0].description || 'Photo'}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <p className="text-white text-sm font-medium">{new Date(photo.date).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-2">{photo.description || 'No description'}</p>
        {photo.songName && (
          <div className="flex items-center mt-2">
            <img src={photo.albumCover} alt="Album cover" className="w-10 h-10 rounded-full mr-2" />
            <div className="flex-grow">
              <p className="text-sm font-medium">{photo.songName}</p>
              <p className="text-xs text-gray-500">{photo.artistName}</p>
            </div>
            <button
              onClick={togglePlayPreview}
              className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center focus:outline-none"
            >
              {isPlaying ? (
                <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 7a1 1 0 112 0v6a1 1 0 11-2 0V7z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
      <div className="flex border-t border-gray-200">
        <button onClick={onEdit} className="flex-1 py-2 text-sm text-center text-gray-500 hover:bg-gray-50">Edit</button>
        <button onClick={onDelete} className="flex-1 py-2 text-sm text-center text-gray-500 hover:bg-gray-50 border-l border-gray-200">Delete</button>
      </div>
    </div>
  );
};

export default PhotoItem;