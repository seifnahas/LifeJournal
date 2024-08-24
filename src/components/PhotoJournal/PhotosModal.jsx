import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, List, Avatar } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { InboxOutlined, DeleteOutlined, SearchOutlined, PlayCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
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
      console.log('Initial data received:', initialData); // Debug statement
      setValue('date', moment(initialData.date));
      setValue('description', initialData.description);
      if (initialData.songName) {
        console.log('Song found:', initialData.songName); // Debug statement
        setSelectedSong({
          id: initialData._id, // Using the photo's ID as a temporary song ID
          name: initialData.songName,
          artists: [{ name: initialData.artistName }],
          album: { images: [{ url: initialData.albumCover }] },
          preview_url: initialData.previewUrl
        });
      } else {
        console.log('No song found in initial data'); // Debug statement
        setSelectedSong(null);
      }
      setFileList(initialData.images ? initialData.images.map((image, index) => ({
        uid: `-${index}`,
        name: `Image ${index + 1}`,
        status: 'done',
        url: image.imageUrl,
      })) : [{
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

  const fetchSongData = async (songId) => {
    try {
      const response = await axios.get(`https://lifejournalbackend.onrender.com/api/spotify/track/${songId}`);
      setSelectedSong(response.data);
    } catch (error) {
      console.error('Error fetching song data:', error);
    }
  };


  useEffect(() => {
    console.log('Selected Song:', selectedSong);
  }, [selectedSong]);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      uid: Date.now() + file.name,
      name: file.name,
      status: 'done',
      url: URL.createObjectURL(file),
      originFileObj: file,
    }));
    setFileList(prevList => [...prevList, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    maxFiles: 5,
  });

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
    };
  }, [audio]);

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
          const response = await axios.get(`https://lifejournalbackend.onrender.com/api/spotify/search?query=${encodeURIComponent(query)}`);
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
    if (audio) {
      audio.pause();
      setAudio(null);
      setIsPlaying(false);
    }
    setSelectedSong(song);
    setSongSearch('');
    setSongSearchResults([]);
  };

  const handleCancel = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
      setIsPlaying(false);
    }
    onCancel();
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
    
    fileList.forEach((file, index) => {
      if (file.originFileObj) {
        formData.append('photos', file.originFileObj);
      } else if (file.url) {
        formData.append(`existingPhotos[${index}]`, file.url);
      }
    });
    
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
      className="bg-gradient-to-r from-pink-100 to-blue-100 rounded-3xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-pink-100 to-blue-100 p-8 rounded-3xl">

      <Form layout="vertical" onFinish={handleSubmit(onFinish)} className="p-8 inter-font">
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
            render={({ field }) => (
              <DatePicker
                {...field}
                className="w-full rounded-full border-2 border-gray-300 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 py-2 px-4"
              />
            )}
          />
        </Form.Item>

        <Form.Item label="Search for a song">
            <Input
              placeholder="Search for a song"
              value={songSearch}
              onChange={handleSongSearch}
              suffix={<SearchOutlined />}
              className="rounded-full border-2 border-gray-300 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 py-2 px-4"
            />
          </Form.Item>
          
          <div className="max-h-48 overflow-y-auto mb-4 bg-white rounded-lg shadow-inner">
            {songSearchResults.length > 0 && (
              <List
                itemLayout="horizontal"
                dataSource={songSearchResults}
                renderItem={(song) => (
                  <List.Item
                    actions={[
                      <Button 
                        disabled={!song.preview_url}
                        icon={<PlayCircleOutlined />}
                        onClick={() => togglePlayPreview(song.preview_url)}
                        className="text-pink-500 hover:text-pink-600 border-none shadow-none"
                      >
                        {isPlaying && selectedSong?.id === song.id ? 'Pause' : 'Play'}
                      </Button>
                    ]}
                    className="hover:bg-gray-50 transition-colors px-4 py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={song.album.images[0].url} className="border-2 border-pink-200" />}
                      title={<a onClick={() => handleSongSelect(song)} className="text-gray-800 hover:text-pink-500 font-semibold">{song.name}</a>}
                      description={<span className="text-gray-600">{song.artists.map(artist => artist.name).join(', ')}</span>}
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
        
          {selectedSong && (
            <div className="bg-white p-4 rounded-lg flex items-center justify-between mb-4 shadow-md">
              <div className="flex items-center">
                <img src={selectedSong.album.images[0].url} alt="Album cover" className="w-12 h-12 object-cover rounded-full mr-4" />
                <div>
                  <p className="font-semibold text-gray-800">{selectedSong.name}</p>
                  <p className="text-sm text-gray-600">{selectedSong.artists[0].name}</p>
                </div>
              </div>
              <Button 
                type="text" 
                icon={<CloseCircleOutlined />} 
                onClick={() => setSelectedSong(null)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          )}
        <Form.Item label="Upload Photos">
          <div {...getRootProps()} className="p-8 border-2 border-dashed border-gray-300 rounded-3xl text-center bg-white hover:bg-gray-50 transition-colors cursor-pointer">
            <input {...getInputProps()} />
            <p className="text-4xl mb-2 text-gray-400"><InboxOutlined /></p>
            <p className="text-gray-600">Click or drag photos to this area to upload</p>
          </div>
        </Form.Item>

        {fileList.map((file, index) => (
          <div key={file.uid} className="mt-4 bg-white rounded-lg shadow-md p-4">
            <img
              src={file.url}
              alt={file.name}
              className="mb-4 max-h-64 mx-auto rounded-lg"
            />
            {/* <Controller
              name={`description${index}`}
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  placeholder={`Description for ${file.name} (optional)`}
                  className="mb-2 rounded-lg border-gray-300 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                />
              )}
            /> */}
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleRemove(file.uid)}
              className="text-red-500 hover:text-red-700"
            >
              Remove Photo
            </Button>
          </div>
        ))}

    <Form.Item className="mt-6">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-gradient-to-r from-pink-500 to-blue-500 border-0 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-blue-600 transition-colors"
          >
            {initialData ? 'Update Entry' : 'Add Entry'}
          </Button>
        </Form.Item>
      </Form>
      </div>
    </Modal>
  );
};

export default PhotosModal;