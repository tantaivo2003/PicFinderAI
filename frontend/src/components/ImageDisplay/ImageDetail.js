import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ImageDetail = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [userOwner, setUserOwner] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchImage();
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchUserOwner = async () => {
      if (!image) return; 

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/albums/${image.album_id}/owner`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserOwner(data);
      } catch (error) {
        console.error("Failed to fetch user owner:", error);
      }
    };

    fetchUserOwner();
  }, [image]); 

  const fetchImage = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/images/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setImage(data);
    } catch (error) {
      console.error("Failed to fetch image:", error);
    }
  };

  if (!image) {
    return <div>Loading...</div>;
  }

  if (!userOwner) {
    return <div>Loading user owner...</div>;
  }

  return (
    <div className="container w-4/5 mx-auto px-5 py-2 lg:px-32 lg:pt-12">
      <h1 className="text-2xl font-semibold mb-4">Image Detail</h1>
      <div className="flex items-center justify-center">
        <img
          src={`${process.env.REACT_APP_API_URL}/imgs/${image.album_id}/${image.img_path}`}
          alt={`Gallery image ${id}`}
          className="rounded-lg w-64 h-auto"
        />
      </div>
      <div className="mt-4">
        <p>
          <span className="font-semibold">Uploader:</span> {userOwner.username}
        </p>
        <p>
          <span className="font-semibold">Captions:</span> {image.captions}
        </p>
      </div>
    </div>
  );
};

export default ImageDetail;
