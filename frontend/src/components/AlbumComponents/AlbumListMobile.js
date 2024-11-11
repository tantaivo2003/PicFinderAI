import React, {useState} from 'react';

const AlbumListMobile = ({ albums, handleAlbumSelect, handleAlbumCreate, handleAlbumDelete, setShowAlbum }) => {
    const [newAlbumName, setNewAlbumName] = useState('');
    const [displayDelete, setDisplayDelete] = useState(0);
    const [chooseAlbum, setChooseAlbum] = useState(1);
    const [showCreateAlbum, setShowCreateAlbum] = useState(false);

    return (
        <div className = "z-50 w-full h-full bg-white md:hidden">
            <div className = "flex items-center mr-3 mb-4">            
                <h2 className="text-xl font-semibold mr-3">Albums</h2>
                <svg onClick = {() => {setShowCreateAlbum(!showCreateAlbum)}} className = "w-5 h-full cursor-pointer" fill="#696969" viewBox="-4.54 -4.54 54.48 54.48" xmlns="http://www.w3.org/2000/svg">
                    <rect x="-4.54" y="-4.54" width="54.48" height="54.48" rx="27.24" fill="#e0e0e0" />
                    <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141 c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27 c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435 c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
                </svg>
            </div>

            {showCreateAlbum && (<div className = "flex border mr-3 mb-4">
                <input
                type="text"
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                placeholder="New album name"
                className="w-3/4 p-2 rounded"
                />
                <button onClick={() => {handleAlbumCreate(newAlbumName); setNewAlbumName('');}} className="w-1/4 bg-gray-200 hover:bg-gray-400 px-1">
                    Create
                </button>
            </div>)}
            <ul className = "mr-3">
            {albums.map((album) => (
                <li
                    onClick={() => {handleAlbumSelect(album.id); setDisplayDelete(album.id); setChooseAlbum(album.id); setShowAlbum(false)}}
                    key={album.id}
                    className={`flex justify-between items-center cursor-pointer py-3 px-2 text-gray-500 hover:bg-gray-200 rounded-md ${chooseAlbum === album.id ? 'font-semibold bg-gray-200' : 'hover:text-gray-700'}`}
                >
                        <span>{album.name}</span>
                        {displayDelete === album.id && (<svg
                            className="w-4 h-4 text-red-500 hover:text-red-700"
                            viewBox="0 0 14 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            onClick={() => handleAlbumDelete(album.id)}
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                fill="currentColor"
                                d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z"
                            />
                        </svg>)}
                </li>
            ))}
            </ul>
        </div>
    );
};

export default AlbumListMobile;
