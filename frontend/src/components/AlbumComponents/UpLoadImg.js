import React, { useState, useEffect } from 'react';

const WebSocketUpload = ({ albums }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadWating, setUploadWating] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const [captions, setCaptions] = useState('');
  const [album, setAlbum] = useState(albums[0].id);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/now_user_full/`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (!data) return "Not logged in";
        } else {
          return "Not logged in";
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        return "Not logged in";
      }
    };

    checkSession();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !captions || !album) {
      alert('Please fill out all fields.');
      return;
    }
    
    setUploadWating(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('album_id', album);
    formData.append('img_path', selectedFile.name);
    formData.append('captions', captions);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/upload-images/`, {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        await response.json();
        alert('Upload successful!');
        window.location.reload();
      } else {
        setUploadWating(false);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadWating(false);
    }
  };

  if (albums.length === 0) return (
    <div className="flex mr-10 items-center justify-center">Please Create One Album To Store Your Images!</div>
  )
  
  return (
    <div className={`relative sm:flex sm:px-5 py-2 ${uploadWating ? 'opacity-50 pointer-events-none' : ''}`}>
      {uploadWating && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-50">
          <span className="text-lg font-semibold items-center justify-center">Uploading...</span>
        </div>
      )}
      
      <div className="flex mx-auto sm:mr-10 items-center justify-center w-3/4 h-full mb-4">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-[20rem] sm:h-128 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Uploaded" className="w-full h-full rounded-lg" />
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF
              </p>
            </div>
          )}
          <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 w-full">
        <div>
          <label htmlFor="captions" className="block mb-2 text-sm font-medium text-gray-900">Caption</label>
          <textarea
            id="captions"
            rows="5"
            value={captions}
            className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
            onChange={(e) => setCaptions(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label htmlFor="album" className="block mb-2 text-sm font-medium text-gray-900">Album</label>
          <select
            id="album"
            className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
            value={album.name}
            onChange={(e) => setAlbum(e.target.value)}
          >
            {albums.map((album) => (
              <option key={album.id} value={album.id} className="cursor-pointer mb-2">
                {album.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleUpload}
            className="inline-flex items-center px-5 py-2.5 ml-4 text-sm font-medium text-center border rounded-lg hover:bg-gray-200"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebSocketUpload;
