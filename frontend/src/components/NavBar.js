import React, { useState, useEffect } from "react";
import Authorize from './AuthorizationComponents/Authorize';
import Register from './AuthorizationComponents/Register';
import TooltipButton from "./TooltipButton";
import SearchHistory from "./SearchComponents/SearchHistory";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [first_name, setFirstName] = useState(null);
  const [last_name, setLastName] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      await checkSession();
    };

    fetchSession();
  }, []);

  const checkSession = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/now_user_full/`, {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            if (!data) return "Not logged in";
            setUserId(data.id);
            setUserRole(data.role);
            setAvatar(data.avatar);
            setEmail(data.email);
            setFirstName(data.first_name);
            setLastName(data.last_name);
            return data.username;
        } else {
            return "Not logged in";
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        return "Not logged in";
    }
  };

  const handleLogout = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/logout/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include'
    });

    await response.json();
    setUserRole(null);
    navigate('/');
    window.location.reload();
  };

  const toggleLoginModal = async (e) => {
      const username = await checkSession();

      if (username === "Not logged in") { 
          setShowLoginModal(!showLoginModal);
      } else {
          toggleDropdown();
      }
  };

  const userSetting = async () => {
    const username = await checkSession();

    if (username === "Not logged in") { 
      setShowLoginModal(!showLoginModal);
    } else {
      navigate('/settings');
    }
};

  const toggleRegisterModal = () => {
      setShowRegisterModal(!showRegisterModal);
  };

  const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
  };


  const handleSearch = async (e) => {
    setDropdownOpen(false);
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      await setHistory();
      setShowHistory(false)
      navigate(`/search/${searchQuery}`);
    }
  };

  const handleSearch1 = async () => {
    setDropdownOpen(false);
    await setHistory();
    navigate(`/search/${searchQuery}`);
  };

  const setHistory = async () => {
    const history = {
      search_term: searchQuery,
      user_id: userId
    };
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/history/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(history)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

        await response.json();
      } catch (error) {
          console.error('Error creating search history:', error);
        }
  };
  const handleInputBlur = () => {
    setTimeout(() => {
        setShowHistory(false);
    }, 500);  // Delay to allow click event to fire
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 body-font text-gray-600 bg-white">
      <div className="container mx-auto flex items-center p-5">
        <TooltipButton tooltipText="Home"  className="ml-2 sm:ml-0 title-font flex items-center font-medium text-gray-900 cursor-pointer">
          <img onClick = {() => {setDropdownOpen(false); navigate(`/`)}} src="/logo.png" alt="Logo" className="w-12 h-12 md:w-20 md:h-20" />
        </TooltipButton>

        <nav className="flex-1 cursor-pointer items-center justify-center font-medium text-black ml-4 md:ml-9 mr-2">
            <div className="relative block">
                <button onClick={handleSearch1}>
                    <span className="absolute inset-y-0 left-1 md:left-2 flex items-center pl-2">
                        <svg className="w-8 h-8 md:w-10 md:h-10" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" fill="#3D3D3D" viewBox="0 0 72 72">
                            <path d="M 31 11 C 19.973 11 11 19.973 11 31 C 11 42.027 19.973 51 31 51 C 34.974166 51 38.672385 49.821569 41.789062 47.814453 L 54.726562 60.751953 C 56.390563 62.415953 59.088953 62.415953 60.751953 60.751953 C 62.415953 59.087953 62.415953 56.390563 60.751953 54.726562 L 47.814453 41.789062 C 49.821569 38.672385 51 34.974166 51 31 C 51 19.973 42.027 11 31 11 z M 31 19 C 37.616 19 43 24.384 43 31 C 43 37.616 37.616 43 31 43 C 24.384 43 19 37.616 19 31 C 19 24.384 24.384 19 31 19 z"></path>
                        </svg>
                    </span>
                </button>
                <input 
                    type="search" 
                    placeholder="The man is wearing a grey jacket and a blue shirt. He is walking." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    onFocus={() => setShowHistory(true)}
                    onBlur={handleInputBlur}
                    onKeyDown={handleSearch} 
                    className="text-lg md:text-xl w-full xl:w-[55rem] 2xl:w-[60rem] rounded-full border-custom-blue bg-slate-200 py-3 pl-14 pr-3 md:py-6 md:pl-20 md:pr-6" 
                />
              {showHistory && (
                <div className="absolute top-full scroll-hidden max-h-[23rem] overflow-y-scroll w-full xl:w-[55rem] 2xl:w-[60rem]">
                  <SearchHistory userId={userId} />
                </div>
              )}
            </div>
        </nav>

        <TooltipButton tooltipText="Contact" className="hidden xl:block rounded-full px-3 py-3 hover:bg-slate-300">
          <a href = "https://www.facebook.com/dientoanbachkhoa">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#3D3D3D">
              <path d="M16.3 11.2c-.4-.2-1.1-.5-2.4-.5-2.1 0-3.3 1-3.3 2.5 0 1.3.9 2 2.4 2 1.1 0 1.8-.5 2.1-.7v1.1c-.3.2-1.1.6-2.2.6-2.6 0-4.1-1.5-4.1-3.3 0-2.2 1.9-3.5 4.1-3.5 1.1 0 1.8.2 2.2.4v1.4zm1.7 1.8c0-.9-.1-1.7-.2-2.4h1.2l.1.7h.1c.2-.3.7-.9 1.7-.9.6 0 1.1.3 1.4.7.3.5.4 1.1.4 2v2.3h-1.3v-2.1c0-.9-.3-1.3-.9-1.3-.5 0-.9.4-1 1-.1 0-.1.2-.1.4v2H18v-2.1zM12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10zm0-1.5c4.7 0 8.5-3.8 8.5-8.5S16.7 3.5 12 3.5 3.5 7.3 3.5 12 7.3 20.5 12 20.5z"></path>
            </svg>
          </a>
        </TooltipButton>
        
        <TooltipButton tooltipText="Your profile" className="hidden xl:block rounded-full px-3 py-3 hover:bg-slate-300" type="button">
        {avatar && (
          <img onClick={userSetting} src={`${process.env.REACT_APP_API_URL}/imgs/user_avatar/${avatar}`} alt="User Avatar" className="w-8 h-8 rounded-full"/>
        )} 
        {!avatar  && (
          <svg onClick={userSetting} xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#3D3D3D" className="bi bi-person-fill" viewBox="0 0 16 16">
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
          </svg>
        )}
        </TooltipButton>
        
        <div className="relative">

        <TooltipButton tooltipText="Options" className="group block rounded-full px-3 py-3 hover:bg-slate-300" type="button">
          <svg onClick={toggleLoginModal} xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#3D3D3D" className="bi bi-chevron-down" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>
          </svg>
        </TooltipButton>

        {dropdownOpen && (<nav className="hidden md:absolute md:top-full md:right-0 md:border bg-white md:rounded-xl antialiased md:block md:w-72" id="navbar-default">
            <ul className="font-medium p-4 md:p-0  text-left text-lg text-black cursor-pointer">
                <li onClick={() => {setDropdownOpen(false); navigate("/settings")}} className="py-2 px-4 flex hover:bg-gray-100">
                  <div>
                      <label htmlFor="avatar" className="block mb-2 text-sm font-normal text-gray-900">Currently in</label>
                      <div className="flex">
                        {avatar && (
                          <img src={`${process.env.REACT_APP_API_URL}/imgs/user_avatar/${avatar}`} alt="User Avatar" className="w-16 h-16 rounded-full"/>
                        )}
                        {!avatar && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="#3D3D3D" className="w-16 h-16 bi bi-person-fill" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                          </svg>
                        )}
                        
                        <div className="md:ml-3 md:mb-2 ">
                          <p className = "text-base text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">{first_name} {last_name}</p>
                          <p className = "text-sm font-">Role: {userRole}</p>
                          <p className = "text-sm font-normal text-gray-700">{email}</p>
                        </div>

                      </div>
                  </div>

                </li>

                <hr/>
                {userRole === "admin" && (                                
                <li onClick = {() => {setDropdownOpen(false); navigate("/admin/users")}} className="py-1 hover:bg-gray-100">
                    <button className="px-4 py-2">Admin</button>
                </li>)}

                <li onClick = {() => {setDropdownOpen(false); navigate("/settings/")}} className="py-1 hover:bg-gray-100">
                  <button className="px-4 py-2">Setting</button>
                </li>

                <li onClick = {() => {setDropdownOpen(false); navigate("/settings/")}} className="py-1 hover:bg-gray-100">
                  <button className="px-4 py-2">Home Feed Tuner</button>
                </li>

                <li onClick = {() => {setDropdownOpen(false); navigate("/album/")}} className="py-1 hover:bg-gray-100">
                  <button className="px-4 py-2">Album</button>
                </li>
                
                <li onClick={handleLogout} className="py-1 hover:bg-gray-100">
                  <button className=" px-4 py-2 text-gray-700 ">Log out</button>
                </li>
            </ul>
        </nav>)
        }
      </div>
      
      </div>
      {dropdownOpen && (
        <div className="fixed z-50 flex w-full h-full bg-white md:hidden">
        <nav className="block md:hidden w-full" id="navbar-default">
            <ul className="font-medium p-4 md:p-0 text-black text-left text-lg cursor-pointer">
                <li onClick={() => {setDropdownOpen(false); navigate("/settings")}} className="py-2 px-4 flex hover:bg-gray-100">
                  <div>
                      <label htmlFor="avatar" className="block mb-2 text-sm font-normal text-gray-900">Currently in</label>
                      <div className="flex">
                        {avatar && (
                          <img src={`${process.env.REACT_APP_API_URL}/imgs/user_avatar/${avatar}`} alt="User Avatar" className="w-16 h-16 rounded-full"/>
                        )}
                        {!avatar && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="#3D3D3D" className="w-16 h-16 bi bi-person-fill" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                          </svg>
                        )}
                        <div className="ml-3 mb-2 ">
                          <p className = "text-base text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">{first_name} {last_name}</p>
                          <p className = "text-sm font-">Role: {userRole}</p>
                          <p className = "text-sm font-normal text-gray-700">{email}</p>
                        </div>

                      </div>
                  </div>

                </li>

                <hr/>
                {userRole === "admin" && (                                
                <li onClick = {() => {setDropdownOpen(false); navigate("/admin/users")}} className="py-1 hover:bg-gray-100">
                    <button className="px-4 py-2">Admin</button>
                </li>)}

                <li onClick = {() => {setDropdownOpen(false); navigate("/settings/")}} className="py-1 hover:bg-gray-100">
                  <button className="px-4 py-2">Setting</button>
                </li>

                <li onClick = {() => {setDropdownOpen(false); navigate("/settings/")}} className="py-1 hover:bg-gray-100">
                  <button className="px-4 py-2">Home Feed Tuner</button>
                </li>

                <li onClick = {() => {setDropdownOpen(false); navigate("/album/")}}  className="py-1 hover:bg-gray-100">
                  <button className="px-4 py-2">Album</button>
                </li>
                
                <li onClick={handleLogout} className="py-1 hover:bg-gray-100">
                  <button className=" px-4 py-2 text-gray-700 ">Log out</button>
                </li>
            </ul>
        </nav>
        </div>
      )}
   
      <Authorize showModal={showLoginModal} toggleLoginModal={toggleLoginModal} toggleRegisterModal={toggleRegisterModal} />
      <Register showModal={showRegisterModal} toggleLoginModal={toggleLoginModal} toggleRegisterModal={toggleRegisterModal}/>
    </header>
  );
};

export default NavBar;
