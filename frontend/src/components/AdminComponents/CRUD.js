import React, { useState, useEffect, useRef, useCallback } from "react";
import UpdateUserModal from './UpdateUser';

const AdminUserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 20; // Number of users to fetch per page
  const observer = useRef();
  const [hasMore, setHasMore] = useState(true); // Flag to indicate if more users need to be loaded

    //Drop down menu setup
    const [dropdownIndex, setDropdownIndex] = useState(null);

    // Update Modal setup
    const [userIdUpdate, setUserIdUpdate] = useState(null);
    const [openUpdateForm, setOpenUpdateForm] = useState(false);
    const dropdownRef = useRef(null);

    // Search query
    const [searchQuery, setSearchQuery] = useState('');
    
  useEffect(() => {
    fetchUsers(page);
  }, [page]);


  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      setHasMore(true);
      const skip = page * limit;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/?skip=${skip}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.length === 0) setHasMore(false);
      setUsers((prevUsers) => {
        const newUsers = data.filter(
          (newUser) => !prevUsers.some((user) => user.id === newUser.id)
        );
        return [...prevUsers, ...newUsers];
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/search_users/${searchQuery.trim()}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.length === 0) {
          alert("No users found");
          window.location.reload();
        }
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        setUsers(users.filter(user => user[0] !== id.toString()));
    } catch (error) {
        alert("Cannot delete an admin user");
    }
    setDropdownIndex(null);
    window.location.reload();
  };

  const handleUpdate = (id) => {
      setUserIdUpdate(id);
      setOpenUpdateForm(true);
  };

  const toggleDropdown = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };
  const toggleUpdateForm = () => {
    setOpenUpdateForm(!openUpdateForm);
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const lastUserRef = useCallback(
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
    [loading, hasMore]
  );

  return (
    <section className="sm:p-5 sm:antialiased">  
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12 bg-white relative shadow-md sm:rounded-lg scroll-hidden overflow-scroll">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-3 pb-5 pt-2">
                <div className="w-full md:w-1/2 flex items-center">
                  <label htmlFor="simple-search" className="sr-only">Search by username</label>
                  <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                          </svg>
                      </div>
                      <input value = {searchQuery} onChange = {(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearch} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2" placeholder="Search by username" required />
                  </div>
                </div>
            </div>
            <hr />
            <table className="table-auto w-full text-center whitespace-no-wrap">
                <thead>
                <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Username</th>
                    <th className="px-4 py-2 max-w-xs truncate">Email</th>
                    <th className="px-4 py-2">Role</th> 
                    <th className="px-4 py-2">Action</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={user.id} ref={index === users.length - 1 ? lastUserRef : null}>
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2 relative">
                        <button onClick={() => toggleDropdown(index)} className=" inline-flex items-center text-sm font-medium ml-2 hover:bg-gray-100 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none" type="button">
                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </button>
                        {dropdownIndex === index && (
                        <div ref={dropdownRef} className="absolute z-20 right-0 w-44 bg-white rounded divide-y divide-gray-100 shadow">
                            <ul className="py-1 text-sm">
                                <li>
                                
                                    <button type="button" onClick={(e) => { e.stopPropagation(); handleUpdate(user.id)}} className="flex w-full items-center py-2 px-4 hover:bg-gray-100 ">
                                        <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                        </svg>
                                        Edit
                                    </button>
                                </li>   

                                <li>
                                    <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(user.id)}} className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-400">
                                        <svg className="w-4 h-4 mr-2" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z" />
                                        </svg>
                                        Delete
                                    </button>
                                </li>
                            </ul>
                        </div>)}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        {loading && <p className="text-center mt-4">Loading users...</p>}
        {!hasMore && <p className="text-center mt-4">All users loaded</p>}
        </div>
        <UpdateUserModal isOpen={openUpdateForm} toggleUpdateForm = {toggleUpdateForm} id = {userIdUpdate}/>
    </section>
  );
};

export default AdminUserTable;
