import React, { useState } from 'react'
import { API_URL } from '../service/config';
import { useSelector } from 'react-redux';

const ChatSections = ({ chat, deleteChatForMe, deleteChat,setText, selectedchat,selectedMessage, OpenChatImage,setSelectedMessage, multiplemessage, setselecetedchat, index, OpenDeleteMenu, setmultiplemessage }) => {
    const id = useSelector((state) => state.user.user._id)
    return (
        <div key={index} className={chat.senderId === id ? "flex flex-col items-end mr-4" : "flex flex-col items-start"}>
            <div className="flex items-center">
                <div
                    className={`p-3 ${chat.senderId === id
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white break-words shadow-lg rounded-tl-xl rounded-br-xl transform transition-transform duration-300"
                        : "bg-gray-200 break-words shadow-md rounded-tr-xl rounded-bl-xl transform transition-transform duration-300"
                        } max-w-xs`}
                >
                    {chat.type === 0 ? (
                        <img
                            onClick={() => OpenChatImage(chat.message)}
                            src={`${API_URL}/uploads/userchat/${chat.message}`}
                            alt="Chat Image"
                            className="max-w-full h-auto"
                            style={{ maxHeight: "200px", objectFit: 'cover' }}
                        />
                    ) : chat.type === 2 ? (
                        <a download="yug.pdf" target='_blank' href={`${API_URL}/uploads/userchat/${chat.message}`}>
                            <i className="fa-solid fa-download mr-2 text-lg font-bold"></i>Download Pdf
                        </a>
                    ) : (
                        <p className="text-base">{chat.message}</p>
                    )}
                </div>
                {chat.senderId === id && chat.status === 1 ? (
                    <div className="relative delete-menu ml-2">
                        {multiplemessage ? null : <input type='checkbox' onClick={()=>setSelectedMessage([...selectedMessage,chat._id])} className='w-6 h-6 rounded-lg'></input>}
                        {multiplemessage === true &&
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setselecetedchat(chat._id)
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <i className="fa-solid fa-ellipsis-vertical fa-bounce"></i>
                                </button>
                            </>
                        }
                        {selectedchat === chat._id && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
                                <ul className="py-2">
                                    <li
                                        onClick={() => deleteChat(chat._id)}
                                        className="px-4 py-2 cursor-pointer text-gray-500"
                                    >
                                        <i class="fa-solid fa-trash mr-2"></i>
                                        Delete For All
                                    </li>
                                    <li
                                        onClick={() => deleteChatForMe(chat._id)}
                                        className="px-4 py-2 cursor-pointer text-gray-500"
                                    >
                                        <i class="fa-solid fa-trash mr-2"></i>Delete For me
                                    </li>
                                    <li
                                        onClick={() => {
                                            OpenDeleteMenu()
                                            setmultiplemessage(false);
                                            setselecetedchat("");
                                        }}
                                        className="px-4 py-2 cursor-pointer text-gray-500"
                                    >
                                        <i class="fa-solid fa-check mr-2"></i>Select Messsage
                                    </li>
                                    <li
                                    onClick={(e) => {
                                        setselecetedchat("");
                                        setText(chat.message);
                                    }}
                                        className="px-4 py-2 cursor-pointer text-gray-500"
                                    >
                                        <i class="fa-solid fa-copy mr-2"></i>Copy Text
                                    </li>
                                    <li
                                        className="px-4 py-2 cursor-pointer text-gray-500"
                                    >
                                        <i class="fa-solid fa-pencil mr-2"></i>Edit Text
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
            <div
                className={`text-xs mt-1 mb-1 ${chat.senderId === id ? "text-right text-lg text-gray-600" : "text-left text-lg text-gray-600"
                    }`}
            >
                {chat.time}
            </div>
        </div>
    )
}

export default ChatSections
