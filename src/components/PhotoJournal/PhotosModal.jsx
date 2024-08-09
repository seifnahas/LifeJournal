// PhotosModal.jsx

import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, List, Avatar } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { InboxOutlined, DeleteOutlined, LeftOutlined, RightOutlined, SearchOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { debounce } from 'lodash';
import moment from 'moment';

const PhotosModal = ({ visible, onSubmit, onCancel, initialData = null }) => {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();
  const [fileList, setFileList] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [songSearch, setSongSearch] = useState('');
  const [songSearchResults, setSongSearchResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (initialData) {
      setValue('date', moment(initialData.date));
      setValue('description', initialData.description);
      setSelectedSong(initialData.songId ? {
        id: initialData.songId,
        name: initialData.songName,
        artists: [{ name: initialData.artistName }],
        album: { images: [{ url: initialData.albumCover }] },
        preview_url: initialData.previewUrl
      } : null);
      setFileList([{
        uid: '1',
        name: 'Current Photo',
        status: 'done',
        url: initialData.imageUrl,
      }]);
    } else {
      // Reset form when opening for a new entry
      setValue('date', null);
      setValue('description', '');
      setSelectedSong(null);
      setFileList([]);
    }
  }, [initialData, setValue]);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      uid: Date.now() + file.name,
      name: file.name,
      status: 'done',
      url: URL.createObjectURL(file),
      originFileObj: file,
    }));
    setFileList(prevList => [...prevList, ...newFiles].slice(0, 5));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    maxFiles: 5,
  });

  const handleRemove = (uid) => {
    const newFileList = fileList.filter(item => item.uid !== uid);
    setFileList(newFileList);
    if (currentPhotoIndex >= newFileList.length) {
      setCurrentPhotoIndex(Math.max(0, newFileList.length - 1));
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query) {
        try {
          const response = await axios.get(`http://localhost:3000/api/spotify/search?query=${encodeURIComponent(query)}`);
          setSongSearchResults(response.data.tracks.items);
        } catch (error) {
          console.error('Error searching songs:', error);
        }
      } else {
        setSongSearchResults([]);
      }
    }, 300),
    []
  );

  const handleSongSearch = (e) => {
    const query = e.target.value;
    setSongSearch(query);
    debouncedSearch(query);
  };

  const handleSongSelect = (song) => {
    setSelectedSong(song);
    setSongSearch('');
    setSongSearchResults([]);
  };

  const togglePlayPreview = (previewUrl) => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(previewUrl);
      newAudio.play();
      setAudio(newAudio);
      setIsPlaying(true);
    }
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append('date', values.date.toISOString());
    formData.append('description', values.description);
    
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('photo', fileList[0].originFileObj);
    }
    
    if (selectedSong) {
      formData.append('songId', selectedSong.id);
      formData.append('songName', selectedSong.name);
      formData.append('artistName', selectedSong.artists[0].name);
      formData.append('albumCover', selectedSong.album.images[0].url);
      formData.append('previewUrl', selectedSong.preview_url);
    }

    onSubmit(formData, initialData?._id);
  };


  const navigatePhoto = (direction) => {
    setCurrentPhotoIndex((prevIndex) => {
      if (direction === 'next') {
        return (prevIndex + 1) % fileList.length;
      } else {
        return (prevIndex - 1 + fileList.length) % fileList.length;
      }
    });
  };

  return (
    <Modal
      visible={visible}
      title={initialData ? "Edit Photo Entry" : "Add New Photo Entry"}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form layout="vertical" onFinish={handleSubmit(onFinish)}>
        <Form.Item
          label="Date"
          required
          validateStatus={errors.date ? 'error' : ''}
          help={errors.date && "Date is required"}
        >
          <Controller
            name="date"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <DatePicker {...field} style={{ width: '100%' }} />}
          />
        </Form.Item>

        <Form.Item label="Search for a song">
          <Input
            placeholder="Search for a song"
            value={songSearch}
            onChange={handleSongSearch}
            suffix={<SearchOutlined />}
          />
        </Form.Item>
        
        <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
          {songSearchResults.length > 0 && (
            <List
              itemLayout="horizontal"
              dataSource={songSearchResults}
              renderItem={(song) => (
                <List.Item
                  actions={[
                    <Button 
                      disabled={!song.preview_url}
                      icon={<PlayCircleOutlined  />}
                      onClick={() => togglePlayPreview(song.preview_url)}
                    >
                      {isPlaying && selectedSong?.id === song.id ? 'Pause' : 'Play'}
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={song.album.images[0].url} />}
                    title={<a onClick={() => handleSongSelect(song)}>{song.name}</a>}
                    description={song.artists.map(artist => artist.name).join(', ')}
                  />
                </List.Item>
              )}
            />
          )}
        </div>
        
        {selectedSong && (
          <div className="selected-song">
            <img src={selectedSong.album.images[0].url} alt="Album cover" width="50" height="50" />
            <span>{selectedSong.name} - {selectedSong.artists[0].name}</span>
            <Button onClick={() => setSelectedSong(null)}>Remove</Button>
          </div>
        )}

        <Form.Item label="Upload Photos (Max 5)">
          <div
            {...getRootProps()}
            className={`p-8 border-2 border-dashed rounded-lg text-center ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-lg mb-2"><InboxOutlined /></p>
            <p>Click or drag photos to this area to upload</p>
          </div>
        </Form.Item>

        {fileList.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <Button
                icon={<LeftOutlined />}
                onClick={() => navigatePhoto('prev')}
                disabled={fileList.length <= 1}
              />
              <span>{`${currentPhotoIndex + 1} / ${fileList.length}`}</span>
              <Button
                icon={<RightOutlined />}
                onClick={() => navigatePhoto('next')}
                disabled={fileList.length <= 1}
              />
            </div>
            <div className="border rounded-lg p-4">
              <img
                src={fileList[currentPhotoIndex].url}
                alt={fileList[currentPhotoIndex].name}
                className="mb-4 max-h-64 mx-auto"
              />
              <Controller
                name={`description`}
                control={control}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    placeholder={`Description (optional)`}
                    className="mb-2"
                  />
                )}
              />
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => handleRemove(fileList[currentPhotoIndex].uid)}
                className="text-red-500"
              >
                Remove Photo
              </Button>
            </div>
          </div>
        )}

        <Form.Item className="mt-4">
          <Button type="primary" htmlType="submit">
            {initialData ? 'Update Entry' : 'Add Entry'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PhotosModal;