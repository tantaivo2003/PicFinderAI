import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Gallery from "./components/ImageDisplay/Gallery";
import Footer from "./components/Footer";
import ImageDetail from "./components/ImageDisplay/ImageDetail";
import AdminUserTable from "./components/AdminComponents/CRUD";
import ImgSearch from "./components/ImageDisplay/ImgSearch";
import Settings from "./components/SettingComponents/Setting";
import ImageUpload from "./components/AlbumComponents/UpLoadImg";

// Albums components
import Album from "./components/AlbumComponents/Album";
function App() {
  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <NavBar/>
          <div className = "mt-24 sm:mt-52 lg:mt-24">
            <Routes>
              <Route path="/" element={<Gallery />} />
              <Route path="/image/:id" element={<ImageDetail />} />
              <Route path="/admin/users" element={<AdminUserTable />} />
              <Route path="/search/:query" element={<ImgSearch />} />
              <Route path="/settings" element={<Settings />} />
              <Route path = "/upload_img" element={<ImageUpload />} />
              <Route path = "/Album" element={<Album />} />
            </Routes>
          </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
