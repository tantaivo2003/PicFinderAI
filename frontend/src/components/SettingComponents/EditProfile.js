import React, { useState, useEffect, useRef } from 'react';

const EditProfile = ({nowUser}) => {
  const [id, setId] = useState(0);

  const [first_name, setFisrtName] = useState('');
  const [last_name, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [avatar, setAvatar] = useState('');
  const fileInputRef = useRef(null);
  const [gender, setGender] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    setId(nowUser.id);
    setFisrtName(nowUser.first_name);
    setLastName(nowUser.last_name);
    setBirthday(nowUser.birthday);
    setAvatar(nowUser.avatar);
    setGender(nowUser.gender);
    setPhoneNumber(nowUser.phone_number);
    setAddress(nowUser.address);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedUser = {
      "id": id,
      "first_name": first_name,
      "last_name": last_name,
      "birthday": birthday,
      "avatar": avatar,
      "gender": gender,
      "phone_number": phone_number,
      "address": address
    };

    console.log(updatedUser);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/change_user_profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedUser),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update user information");
      }
  
      await response.json();
      alert("Updated successfully");
      window.location.reload();
      
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Only image files are allowed.');
      console.error('Only image files are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/upload-avatar/${id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'An error occurred while uploading the file.');
      }

      const data = await response.json();
      setAvatar(`${data}`);
      window.location.reload();
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  return (
    <div>
      <p className="italic text-sm py-5">Keep your personal details private. Information you add here is visible to anyone who can view your profile.</p>
      <form action="#">
      <div className="flex mb-4">
      
        <div>
            <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-gray-900">Avatar</label>
            {avatar && (
              <img src={`${process.env.REACT_APP_API_URL}/imgs/user_avatar/${avatar}`} alt="User Avatar" className="w-24 h-24 rounded-full"/>
            )}
            {!avatar && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="#3D3D3D" className="w-24 h-24" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
              </svg>
            )}
        </div>

        <button
          type="button"
          onClick={handleFileSelect}
          className="h-1/5 items-center px-6 py-3 mt-12 ml-4 text-sm font-medium text-center border rounded-lg hover:bg-gray-200"
        >
          Change
        </button>
        <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleAvatarChange}
      />

      </div>
      
        <div className="grid gap-4 mb-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-gray-900">First Name</label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              value={first_name}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setFisrtName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="lastname" className="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              value={last_name}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="birthday" className="block mb-2 text-sm font-medium text-gray-900">Birthday</label>
            <input
              type="date"
              name="birthday"
              id="birthday"
              value={birthday}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
          
          <div>
              <label
                htmlFor="gender"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Gender
              </label>
              <select
                  id="gender"
                  className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
                  value = {gender}
                  onChange={(e) => setGender(e.target.value)}
              >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="None">None</option>
              </select>
            </div>


          <div>
            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">Address</label>
            <input
              id="address"
              value={address}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>


          <div>
            <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-900">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              id="phone_number"
              value={phone_number}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

        </div>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleUpdate}
            className="inline-flex items-center px-5 py-2.5 ml-4 text-sm font-medium text-center border rounded-lg hover:bg-gray-200"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
