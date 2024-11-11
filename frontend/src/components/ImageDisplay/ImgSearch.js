import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ImgSearch = () => {
  const navigate = useNavigate();  
  const { query } = useParams();
  const [images, setImages] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setImages([]); // Clear images when the query changes
    fetchImages(); // Fetch images for the first page
  }, [query]);


  const fetchImages = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/query/${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data);
        setLoading(false);
      }
    } 
    catch (error) {
      console.log(`Error: ${error.message}`);
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
            alt={`Search results`}
          />
        </div>
      </div>
    ));
  };

  if (loading) return (
    <p className="text-center mt-4 mx-auto px-5 py-2 lg:px-32 lg:pt-12">Loading images...</p>
  );
  return (
    <section className="body-font text-gray-600">
      <div className="container mx-auto px-5 lg:px-32">
      <h1 className="text-3xl font-semibold text-custom-blue mt-4 mb-6">Result for {query}:</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {renderImages()}
        </div>
      </div>
    </section>
  );
};

export default ImgSearch;
