import React from 'react';
import { useSelector } from 'react-redux';
import { API_URL } from '../service/config';

const ChatSections = ({
    chat,
    deleteChatForMe,
    selectAll,
    deleteChat,
    setText,
    selectedchat,
    selectedMessage,
    OpenChatImage,
    setSelectedMessage,
    multiplemessage,
    setselecetedchat,
    index,
    OpenDeleteMenu,
    setmultiplemessage
}) => {
    const id = useSelector((state) => state.user.user._id);
    return (
        <div
            key={index}
            className={chat.senderId === id ? "flex flex-col items-end mr-4" : "flex flex-col items-start ml-2"}
        >
            <div className="flex items-center">
                <div className="relative delete-menu mr-2">
                    {!multiplemessage && chat.senderId !== id && (
                        <input
                            type="checkbox"
                            checked={selectAll || selectedMessage.includes(chat._id)}
                            onClick={() => {
                                if (selectedMessage.includes(chat._id)) {
                                    setSelectedMessage(selectedMessage.filter(id => id !== chat._id));
                                } else {
                                    setSelectedMessage([...selectedMessage, chat._id]);
                                }
                            }}
                            className="w-6 h-6 rounded-lg"
                        />
                    )}
                    {chat.senderId !== id &&
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setselecetedchat(chat._id);
                            }}
                            className="text-gray-500 hover:text-gray-700 mr-2 ml-2"
                        >
                            <i className="fa-solid fa-ellipsis-vertical fa-bounce"></i>
                        </button>
                    }
                </div>
                <div
                    className={`p-3 ${chat.senderId === id
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "bg-gray-200 text-black"
                        } break-words shadow-lg rounded-tl-xl rounded-br-xl max-w-xs`}
                >
                    {chat.type === 0 ? chat.status === 2 ? "this message is deleted" : (
                        <img
                            onClick={() => OpenChatImage(chat.message)}
                            src={`${API_URL}/uploads/userchat/${chat.message}`}
                            alt="Chat Image"
                            className="max-w-full h-auto"
                            style={{ maxHeight: "200px", objectFit: 'cover' }}
                        />
                    ) : chat.type === 2 ? chat.status === 2 ? "this message is deleted" : (
                        <a
                            download="yug.pdf"
                            target="_blank"
                            href={`${API_URL}/uploads/userchat/${chat.message}`}
                        >
                            <i className="fa-solid fa-download mr-2 text-lg font-bold"></i>Download Pdf
                        </a>
                    ) : (
                        <p className="text-base">{chat.status === 2 ? "this message is deleted" : chat.message}</p>
                    )}
                </div>

                <div className="relative delete-menu ml-2">
                    {!multiplemessage && chat.senderId === id && (
                        <input
                            type="checkbox"
                            checked={selectAll || selectedMessage.includes(chat._id)}
                            onClick={() => {
                                if (selectedMessage.includes(chat._id)) {
                                    setSelectedMessage(selectedMessage.filter(id => id !== chat._id));
                                } else {
                                    setSelectedMessage([...selectedMessage, chat._id]);
                                }
                            }}
                            className="w-6 h-6 rounded-lg"
                        />
                    )}
                    {chat.senderId === id &&
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setselecetedchat(chat._id);
                            }}
                            className="text-gray-500 hover:text-gray-700 ml-2"
                        >
                            <i className="fa-solid fa-ellipsis-vertical fa-bounce"></i>
                        </button>}
                    {selectedchat === chat._id && (
                        <div className={`absolute ${chat.senderId === id ? 'right-0' : "left-0"} top-full mt-2 w-48 bg-white shadow-lg rounded-lg z-10`}>
                            <ul className="py-2">
                                {chat.senderId === id && (
                                    <li
                                        onClick={() => deleteChat(chat._id)}
                                        className="px-4 py-2 cursor-pointer text-gray-500"
                                    >
                                        <i className="fa-solid fa-trash mr-2"></i>Delete For All
                                    </li>
                                )}
                                <li
                                    onClick={() => deleteChatForMe(chat._id)}
                                    className={`cursor-pointer text-gray-500 px-4 py-2 `}
                                >
                                    <i className="fa-solid fa-trash mr-2"></i>{chat.senderId === id ? 'Delete For Me' : "Delete"}
                                </li>
                                <li
                                    onClick={() => {
                                        setselecetedchat("");
                                        setText(chat.message);
                                    }}
                                    className={`cursor-pointer text-gray-500 px-4 py-2 `}
                                >
                                    <i className="fa-solid fa-copy mr-2"></i>Copy Text
                                </li>
                                <li
                                    onClick={() => {
                                        OpenDeleteMenu();
                                        setmultiplemessage(false);
                                        setselecetedchat("");
                                    }}
                                    className={`cursor-pointer text-gray-500 px-4 py-2  `}
                                >
                                    <i className="fa-solid fa-check mr-2"></i>Select Message
                                </li>
                                {chat.senderId === id && (
                                    <>
                                        <li
                                            className="px-4 py-2 cursor-pointer text-gray-500"
                                        >
                                            <i className="fa-solid fa-pencil mr-2"></i>Edit Text
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div
                className={`text-xs mt-1 mb-1 ${chat.senderId === id ? "text-right text-lg text-gray-600" : "text-left text-lg text-gray-600"}`}
            >
                {chat.time}
            </div>
        </div>
    );
};

export default ChatSections;
