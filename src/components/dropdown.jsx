import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const Dropdown = ({ deleteMessage, selectChat }) => {
    const [showMenu, setShowMenu] = useState(false);
    const hideDisplay = (e) => {
        const deleteMenu = document.querySelector(".delete-menu");
        if (deleteMenu && !deleteMenu.contains(e.target)) {
            setShowMenu(false);
        }
    };
    useEffect(() => {
        if (showMenu === true) {
            document.addEventListener('click', hideDisplay);
            return () => {
                document.removeEventListener('click', hideDisplay);
            };
        }
    }, []);
    const showSwal = () => {
        Swal.fire({
            title: "Are u sure want to delete?",
            showDenyButton: true,
            confirmButtonText: "Delete",
            denyButtonText: `Cancel`
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMessage();
                Swal.fire("Saved!", "success");
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    }
    return (
        <>
            <i className="fa-solid fa-ellipsis-vertical fa-bounce text-xl text-right font-bold text-gray-700 mb-2 px-2 mr-8"
                onClick={(e) => {
                    setShowMenu(true)
                }}></i>
            <div className='relative'>
                {showMenu && <div className="absolute top-full mt-2 w-40 bg-white shadow-lg rounded-lg z-10 delete-menu right-0">
                    <ul className="py-2">
                        <li
                            onClick={(e) => {
                                e.stopPropagation();
                                showSwal();
                                selectChat()
                                setShowMenu(false)
                            }}
                            className="px-4 py-2 cursor-pointer text-gray-500"
                        >
                            <i className="fa-solid fa-trash mr-2"></i>Clear Chat
                        </li>
                    </ul>
                </div>
                }
            </div>
        </>
    )
}

export default Dropdown
