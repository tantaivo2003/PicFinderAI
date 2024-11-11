import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Gallery = () => {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 28; // Số lượng ảnh mỗi trang
  const galleryRef = useRef(null); // Ref cho phần container của Gallery
  const observer = useRef();
  const [hasMore, setHasMore] = useState(true); // có cần load tiếp hay không?
  
  useEffect(() => {
    fetchImages(page);
  }, [page]);

  const fetchImages = async (page) => {
    try {
      setLoading(true);
      setHasMore(true);
      const skip = page * limit;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/random_images/?total=${limit}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    console.log(response);
      const data = await response.json();
      if (data.length === 0)
        setHasMore(false);
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

  const renderImages = () => {
    return images.map((image, index) => (
      <div
        key={image.id}
        className="relative group"
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(image.id)}
      >
        <div
          className={`w-full h-[21rem] overflow-hidden rounded-lg relative transition-all duration-300 ${
            focusedIndex === index ? "scale-110" : "scale-100"
          }`}
          onMouseEnter={() => setFocusedIndex(index)}
          onMouseLeave={() => setFocusedIndex(null)}
        >
          <img
            className={`w-full h-full object-cover rounded-lg cursor-pointer`}
            src={`${process.env.REACT_APP_API_URL}/imgs/${image.album_id}/${image.img_path}`}
            alt={`Gallery`}
          />
        </div>
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

  return (
    <section className="body-font text-gray-600">
      <div ref={galleryRef} className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {renderImages()}
        </div>
        {loading && <p className="text-center mt-4">Loading images...</p>}
        {!hasMore && <p className="text-center mt-4">All images</p>}
        <div ref={lastImageRef} className="h-1" />
      </div>
    </section>
  );
};

export default Gallery;
