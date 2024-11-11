import React, { useState,useEffect } from 'react';
import EditProfile from './EditProfile';
import AccountManagement from './AccountManagement';
import HomeFeed from './HomeFeed';
import Notifications from './Notifications';
import PrivacyAndData from './PrivacyAndData';
import Security from './Security';
import { useNavigate } from "react-router-dom";
const Setting = () => {
  const navigate = useNavigate();
  const [pageSetting, setPageSetting] = useState("edit-profile");
  const [nowUser, setNowUser] = useState();
  const [showSettingsBar, setSettingsBar] = useState(false);

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
              setNowUser(data);
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

  return (
    <div className="flex px-5 py-2 lg:px-40 lg:pt-12">
      <div className="hidden sm:block sm:w-1/4 pr-4 border-r border-gray-300">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <ul>
          <li className="hover:bg-gray-200 rounded-md">
            <button 
              onClick={() => setPageSetting("edit-profile")} 
              className={`py-3 px-2 text-gray-500 ${pageSetting === "edit-profile" ? 'font-semibold' : 'hover:text-gray-700'}`}
            >
              Edit Profile
            </button>
          </li>
          <li className="hover:bg-gray-200 rounded-md">
            <button 
              onClick={() => setPageSetting("account-management")} 
              className={`py-3 px-2 text-gray-500 ${pageSetting === "account-management" ? 'font-semibold' : 'hover:text-gray-700'}`}
            >
              Account Management
            </button>
          </li>
          <li className=" hover:bg-gray-200 rounded-md">
            <button 
              onClick={() => setPageSetting("home-feed")} 
              className={`py-3 px-2 text-gray-500 ${pageSetting === "home-feed" ? 'font-semibold' : 'hover:text-gray-700'}`}
            >
              Turn Your Home Feed
            </button>
          </li>
          <li className=" hover:bg-gray-200 rounded-md">
            <button 
              onClick={() => setPageSetting("notifications")} 
              className={`py-3 px-2 text-gray-500 ${pageSetting === "notifications" ? 'font-semibold' : 'hover:text-gray-700'}`}
            >
              Notifications
            </button>
          </li>
          <li className=" hover:bg-gray-200 rounded-md">
            <button 
              onClick={() => setPageSetting("privacy-and-data")} 
              className={`py-3 px-2 text-gray-500 ${pageSetting === "privacy-and-data" ? 'font-semibold' : 'hover:text-gray-700'}`}
            >
              Privacy and Data
            </button>
          </li>
          <li className=" hover:bg-gray-200 rounded-md">
            <button 
              onClick={() => setPageSetting("security")} 
              className={`py-3 px-2 text-gray-500 ${pageSetting === "security" ? 'font-semibold' : 'hover:text-gray-700'}`}
            >
              Security
            </button>
          </li>
        </ul>
      </div>

      {/* Right side content */}
      {showSettingsBar && (
        <div className="fixed z-50 flex w-full h-full bg-white md:hidden">
          <nav className="block md:hidden w-full" id="navbar-default">            
            <ul className="font-medium text-left text-lg cursor-pointer">
              <li className="py-2 px-4 flex hover:bg-gray-100">
                <div onClick={() => {setSettingsBar(false)}} >
                    <label htmlFor="avatar" className="block mb-2 text-sm font-normal text-gray-900">Currently in</label>
                    <div className="flex">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/imgs/user_avatar/${nowUser.avatar}`}
                        alt="User Avatar"
                        className="w-16 h-16 mr-4 rounded-full"
                      />
                      <div className="md:ml-3 md:mb-2 ">
                        <p className = "text-base text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">{nowUser.first_name} {nowUser.last_name}</p>
                        <p className = "text-sm font-">Role: {nowUser.role}</p>
                        <p className = "text-sm font-normal text-gray-700">{nowUser.email}</p>
                      </div>

                    </div>
                </div>

              </li>

              <hr/>

              <li onClick = {() => {setPageSetting("edit-profile"); setSettingsBar(false)}}  className="py-1 hover:bg-gray-100">
                <button className="px-4 py-2">Edit Profile</button>
              </li>

              <li onClick = {() => {setPageSetting("account-management"); setSettingsBar(false)}} className="py-1 hover:bg-gray-100">
                <button className="px-4 py-2">Account Management</button>
              </li>

              <li onClick = {() => {navigate("/album/")}} className="py-1 hover:bg-gray-100">
                <button className="px-4 py-2">Turn Your Home Feed</button>
              </li>

              <li onClick = {() => {setPageSetting("notifications"); setSettingsBar(false)}} className="py-1 hover:bg-gray-100">
                <button className="px-4 py-2">Notifications</button>
              </li>

              <li onClick = {() => {setPageSetting("privacy-and-data"); setSettingsBar(false)}} className="py-1 hover:bg-gray-100">
                <button className="px-4 py-2">Privacy And Data</button>
              </li>

              <li onClick = {() => {setPageSetting("security"); setSettingsBar(false)}} className="py-1 hover:bg-gray-100">
                <button className="px-4 py-2">Security</button>
              </li>

              </ul>
            
          </nav>
        </div>)}
      <div className="w-full sm:w-3/4 pl-4">
          <>
          <div className="flex items-center">
            <button className="block sm:hidden rounded-full pr-3 py-3" onClick = {() => setSettingsBar(true)}>
              <svg className = "hover:bg-slate-300" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="28" height="28" viewBox="0 0 24 24" fill="#3D3D3D">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
              <g>
                <path d="M0,3.875c0-1.104,0.896-2,2-2h20.75c1.104,0,2,0.896,2,2s-0.896,2-2,2H2C0.896,5.875,0,4.979,0,3.875z M22.75,10.375H2 c-1.104,0-2,0.896-2,2c0,1.104,0.896,2,2,2h20.75c1.104,0,2-0.896,2-2C24.75,11.271,23.855,10.375,22.75,10.375z M22.75,18.875H2 c-1.104,0-2,0.896-2,2s0.896,2,2,2h20.75c1.104,0,2-0.896,2-2S23.855,18.875,22.75,18.875z"></path>
              </g>
            </g></svg>
            </button>

            {pageSetting === "edit-profile" && <h1 className="text-xl font-semibold">Edit Profile</h1>}
            {pageSetting === "account-management" && <h1 className="text-xl font-semibold">Account Management</h1>}            
            {pageSetting === "home-feed" && <h1 className="text-xl font-semibold">Home Feed</h1>}            
            {pageSetting === "notifications" && <h1 className="text-xl font-semibold">Notifications</h1>}           
            {pageSetting === "privacy-and-data" && <h1 className="text-xl font-semibold">Privacy And Data</h1>}
            {pageSetting === "security" && <h1 className="text-xl font-semibold">Security</h1>}
          </div>
          </>

        {pageSetting === "edit-profile" && nowUser && <EditProfile nowUser={nowUser}/>}
        {pageSetting === "account-management" && nowUser && <AccountManagement nowUser={nowUser}/>}
        {pageSetting === "home-feed"&& nowUser  && <HomeFeed />}
        {pageSetting === "notifications" && nowUser && <Notifications />}
        {pageSetting === "privacy-and-data" && nowUser  && <PrivacyAndData />}
        {pageSetting === "security" && nowUser && <Security />}
      </div>
    </div>
  );
};

export default Setting;
