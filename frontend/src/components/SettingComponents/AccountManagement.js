import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const AccountManagement = ({nowUser}) => {
  const navigate = useNavigate();
  const [id, setId] = useState(0);
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const [isChangePassword, setIsChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmPassword] = useState('');
  useEffect(() => {
    setId(nowUser.id);
    setUserName(nowUser.username);
    setEmail(nowUser.email);
    setRole(nowUser.role);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedUser = {
      "id": id,
      "role": role,
      "username": username,
      "email": email
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/change_user_account`, {
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
        alert("Username or email already exist!");
        return;
      }
      alert("Updated successfully, Sign in to update information");
      await handleLogout();
      
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
      console.log("User updated successfully:", data);
      setIsChangePassword(false);
      navigate("/");
    } catch (error) {
      console.error("Error updating user information:", error);
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
    navigate('/');
    window.location.reload();
  };


  if (isChangePassword) return (
    <div
    aria-hidden="true"
    className="fixed inset-0 z-50 flex items-center justify-center w-full h-full p-4 overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-75"
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
              className="inline-flex items-center px-5 py-2.5 ml-4 text-sm font-medium text-center border rounded-lg bg-gray-300"
          >
              Change User Password
          </button>
        </div>

      </form>
    </div>
  </div>
  );
  return (
    <div>
      <p className="italic text-sm py-5">Keep your personal details private. Information you add here is visible to anyone who can view your profile.</p>
      <form action="#">
        <div className="grid gap-4 mb-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
            <input
              type="text"
              name="name"
              id="name"
              value={username}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900">Role</label>
            <select
              id="role"
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled
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
            Update
          </button>

          <button
            type="button"
            onClick={() => setIsChangePassword(true)}
            className="inline-flex items-center px-5 py-2.5 ml-4 text-sm font-medium text-center border rounded-lg hover:bg-gray-200"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountManagement;
