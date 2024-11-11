import React, { useState, useEffect, useRef } from "react";

const UpdateUserModal = ({ isOpen, toggleUpdateForm, id}) => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const [first_name, setFisrtName] = useState('');
  const [last_name, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [avatar, setAvatar] = useState('');
  const fileInputRef = useRef(null);
  const [gender, setGender] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const [isBanned, setIsBanned] = useState(false);
  //variable for update password
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/users_by_id/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserName(data.username);
            setEmail(data.email);
            setRole(data.role);

            setFisrtName(data.first_name);
            setLastName(data.last_name);
            setBirthday(data.birthday);
            setAvatar(data.avatar);
            setGender(data.gender);
            setPhoneNumber(data.phone_number);
            setAddress(data.address);
            setIsBanned(data.is_banned);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [isOpen, id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedUser = {
      "id": id,
      "role": role,
      "username": username,
      "email": email,
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/change_user_info`, {
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
  
      const data = await response.json();
      if (!data){
        alert("Username or email already exists!")
        return;
      }
      alert("Updated successfully");
      window.location.reload();
      
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };


  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword)
      {
        alert("Password does not match");
        return;
      }

    if (newPassword.length < 6){
      alert("The password must be at least 6 characters long.");
      return;
    }
    const updatedPasswordUser = {
      "id": id,
      "password": newPassword
    };
    console.log(updatedPasswordUser);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/change_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedPasswordUser),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update user information");
      }
  
      const data = await response.json();
      alert("Updated successfully:", data);
      setIsChangePassword(false);
      
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

  if (!isOpen && !isChangePassword) return null;

  if (isChangePassword) return (
    <div
    aria-hidden="true"
    className="fixed inset-0 z-50 flex items-center justify-center w-full h-full p-4 overflow-y-auto overflow-x-scroll bg-gray-800 bg-opacity-75"
  >
    <div className="relative w-full max-w-2xl max-h-full p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between pb-4 mb-4 border-b rounded-t sm:mb-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Change User Password
        </h3>
        <button
          type="button" onClick = {() => setIsChangePassword(false)}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
      </div>
      <form action="#">
        <div className="grid gap-4 mb-4 sm:grid-cols-2">

          <div>
            <label
              htmlFor="newpassword"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              New Password
            </label>
            <input
              type="password"
              name="newpassword"
              id="newpassword"
              value = {newPassword}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="confirmnewpassword"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmnewpassword"
              id="confirmnewpassword"
              value = {confirmNewPassword}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
      
        </div>
        <div className="flex items-center justify-end">

          <button
              type="button"
              onClick={handleChangePassword} 
              className="inline-flex items-center px-5 py-2.5 ml-4 text-sm font-medium text-center border rounded-lg hover:bg-gray-200"
          >
              Change User Password
          </button>
        </div>

      </form>
    </div>
  </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-y-scroll overflow-x-scroll bg-gray-800 bg-opacity-75"
    >
      <div className="w-full mt-auto sm:mt-20 max-w-2xl p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between pb-4 mb-4 border-b rounded-t sm:mb-5">
          <h3 className="top-20 text-lg font-semibold text-gray-900">
            Update User
          </h3>
          <button
            type="button" onClick = {toggleUpdateForm}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

      <div className="flex mb-4">
        <div>
            <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-gray-900">Avatar</label>
            {avatar && (
              <img src={`${process.env.REACT_APP_API_URL}/imgs/user_avatar/${avatar}`} alt="User Avatar" className="w-20 h-20 rounded-full"/>
            )}
            {!avatar && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="#3D3D3D" className="w-20 h-20" viewBox="0 0 16 16">
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
            <label
              htmlFor="firstname"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              value = {first_name}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setFisrtName(e.target.value)}
            />
          </div>

            <div>
              <label
                htmlFor="lastname"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                value = {last_name}
                className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
                onChange={(e) => setLastName(e.target.value)}
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
        </div>

        <div className="grid gap-4 mb-4 sm:grid-cols-1">  
            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">Address</label>
            <textarea
              id="address"
              rows="5"
              value={address}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
        </div>

        <div className="grid gap-4 mb-4 sm:grid-cols-2">
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
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Username
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value = {username}
                className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value = {email}
                className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label
                htmlFor="role"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Role
              </label>
                <select
                    id="role"
                    className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
                    value = {role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

          </div>
          <div className="flex items-center justify-end">
            <button
                type="button"
                onClick={handleUpdate}
                className="inline-flex items-center px-5 py-2.5 ml-4 text-sm font-medium text-center border rounded-lg hover:bg-gray-200"
            >
                Update User
            </button>

            <button
                type="button"
                onClick={()  => {toggleUpdateForm(); setIsChangePassword(true)} 
                }
                className="inline-flex items-center px-5 py-2.5 ml-4 text-sm font-medium text-center border rounded-lg hover:bg-gray-200"
            >
                Change User Password
            </button>
          </div>
      </div>
    </div>
  );
};

export default UpdateUserModal;
