import React, { useState, useEffect } from 'react';
import AlbumList from './AlbumList';
import AlbumImages from './AlbumImages';
import WebSocketUpload from './UpLoadImg';
import AlbumListMobile from './AlbumListMobile';

const Album = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(0);
  const [userId, setUserId] = useState(null);

  const [isCreateImage, setIsCreateImage] = useState(false);
  const [showAlbum, setShowAlbum] = useState(false);
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/now_user_id/`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUserId(data);
          fetchAlbums(data);
        } else {
          console.error('Failed to fetch user ID');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  const fetchAlbums = async (ownerId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/albums?user_id=${ownerId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length != 0 ){
          setAlbums(data);
          setSelectedAlbum(data[0].id);
        }

      } else {
        console.error('Failed to fetch albums');
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  const handleAlbumSelect = (albumId) => {
    setSelectedAlbum(albumId);
    setIsCreateImage(false);
  };

  const handleAlbumCreate = async (newAlbumName) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/albums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newAlbumName, owner_id: userId }),
      });
      if (response.ok) {
        const newAlbum = await response.json();
        setAlbums([...albums, newAlbum]);
      } else {
        console.error('Failed to create album');
      }
    } catch (error) {
      console.error('Error creating album:', error);
    }
  };
  
  
  const handleAlbumDelete = async (albumId) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/albums/${albumId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        await fetchAlbums();
    }
    else {
        alert('Failed to delete album');
    }
    window.location.reload();
  };
  return (
    <div className="flex px-5 py-2 lg:px-40 lg:pt-12 ">
      <div className="hidden sm:block sm:w-1/3 h-screen overflow-y-scroll border-r border-gray-200">
        <AlbumList albums={albums} handleAlbumSelect={handleAlbumSelect} handleAlbumCreate={handleAlbumCreate} handleAlbumDelete={handleAlbumDelete} />
      </div>
      {showAlbum && <AlbumListMobile albums={albums} handleAlbumSelect={handleAlbumSelect} handleAlbumCreate={handleAlbumCreate} handleAlbumDelete={handleAlbumDelete} setShowAlbum={setShowAlbum}/>}
      
      {!showAlbum && (<div className="w-full sm:w-2/3 h-screen ml-4 overflow-y-auto">
        <div className = "flex items-center mr-3">     
            <button className="block sm:hidden rounded-full pr-3 py-3" onClick = {() => setShowAlbum(true)}>
              <svg className = "hover:bg-slate-300" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="28" height="28" viewBox="0 0 24 24" fill="#3D3D3D">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
              <g>
                <path d="M0,3.875c0-1.104,0.896-2,2-2h20.75c1.104,0,2,0.896,2,2s-0.896,2-2,2H2C0.896,5.875,0,4.979,0,3.875z M22.75,10.375H2 c-1.104,0-2,0.896-2,2c0,1.104,0.896,2,2,2h20.75c1.104,0,2-0.896,2-2C24.75,11.271,23.855,10.375,22.75,10.375z M22.75,18.875H2 c-1.104,0-2,0.896-2,2s0.896,2,2,2h20.75c1.104,0,2-0.896,2-2S23.855,18.875,22.75,18.875z"></path>
              </g>
            </g></svg>
            </button>       
          <h2 className="text-xl font-semibold mr-3">Images</h2>
          <svg onClick = {() => {setIsCreateImage(!isCreateImage)}} className = "w-5 h-full cursor-pointer" fill="#696969" viewBox="-4.54 -4.54 54.48 54.48" xmlns="http://www.w3.org/2000/svg">
              <rect x="-4.54" y="-4.54" width="54.48" height="54.48" rx="27.24" fill="#e0e0e0" />
              <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141 c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27 c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435 c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
          </svg>
        </div>
          {(albums.length != 0 && isCreateImage) ? (<WebSocketUpload albums={albums} />):(<AlbumImages albumId={selectedAlbum} />)}
      </div>)}

    </div>
  );
};

export default Album;
