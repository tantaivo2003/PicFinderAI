import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AlbumImages = ({ albumId }) => {
  const [images, setImages] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 30; // Số lượng ảnh mỗi trang

  const navigate = useNavigate();
  const galleryRef = useRef(null); // Ref cho phần container của Gallery
  const observer = useRef();
  const [hasMore, setHasMore] = useState(true); // Có cần tải tiếp ảnh mới hay không?

  useEffect(() => {
    setImages([]);
    setPage(0);
    setHasMore(true);
  }, [albumId]);

  useEffect(() => {
    fetchImages(page);
  }, [page, albumId]);

  const fetchImages = async (page) => {
    try {
      setLoading(true);
      const skip = page * limit;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/albums/images/?album_id=${albumId}&skip=${skip}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length === 0) setHasMore(false);

      setImages((prevImages) => {
        // Kiểm tra và loại bỏ các ảnh trùng lặp
        const newImages = data.filter(
          (newImage) => !prevImages.some((image) => image.id === newImage.id)
        );
        return [...prevImages, ...newImages];
      });
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (index) => {
    setFocusedIndex(index);
  };

  const handleMouseLeave = () => {
    setFocusedIndex(null);
  };

  const handleClick = (index) => {
    navigate(`/image/${index}`);
  };

  const handleDelete = async (image) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/albums/images/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(image),
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setImages((prevImages) => prevImages.filter((img) => img.id !== image.id));
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const renderImages = () => {
    return images.map((image, index) => (
      <div
        key={image.id}
        className="relative group"
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(image.id)}
      >
        <div className="w-full h-full overflow-hidden rounded-lg">
          <img
            className={`w-full h-full object-cover cursor-pointer transform transition-transform duration-300 ${
              focusedIndex === index ? "scale-110" : "scale-100"
            }`}
            src={`${process.env.REACT_APP_API_URL}/imgs/${image.album_id}/${image.img_path}`}
            alt={`Gallery image ${index}`}
          />
        </div>
        {focusedIndex === index && (
          <div
            className="absolute top-2 right-2 bg-white rounded-full p-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(image);
            }}
          >
            <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        )}
      </div>
    ));
  };

  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  if (albumId == 0) return (
    <div className="flex items-center justify-center">
      Create Your Album To Create Your Images!
    </div>
  )
  return (
    <section ref={galleryRef} className="container mx-auto px-5 py-2 lg:px-32">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {renderImages()}
      </div>
      {loading && <p className="text-center mt-4">Loading images...</p>}
      <div ref={lastImageRef} className="h-1" />
    </section>
  );
};

export default AlbumImages;
