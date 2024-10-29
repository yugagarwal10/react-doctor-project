import React, { useState, useEffect, useRef } from 'react';
import { Delete, get, patch, post } from '../../service/axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../service/config';
import { useLocation, useNavigate } from 'react-router-dom';
import { Socket } from '../../service/socket';
import TicketDetails from '../../components/ticketDetails';
import ChatSections from '../../components/chatSections';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import Showimage from '../../components/showimage';

const UserChats = () => {
  const [history, setHistory] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState({
    message: "",
    image: ""
  });
  const [image, showImage] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [showimage, setshowimage] = useState(false);
  const [emojiVisible, setEmojiVisible] = useState(false);
  const [showseen, setshowseen] = useState(false);
  const [loader, setloader] = useState(false);
  const [selecetedchat, setselecetedchat] = useState("");
  const id = useSelector((state) => state.user.user._id)
  const getUser = async () => {
    try {
      const res = await get(API_URL + `/userTicketDetails?ticket=${location.state._id}`);
      setTicket(res)
    } catch (error) {
      toast.error("Cannot get details");
    }
  }
  useEffect(() => {
    if (history.length > 0) {
      scroll();
      checkSeen();
    }
  }, [history])
  const checkSeen = () => {
    if (history.length !== 0) {
      const all = history.filter((user) => user.senderId === id);
      const last = all.pop();
      if (last) {
        if (last.seen && last.seen === 1) {
          setshowseen(true);
        }
        else {
          setshowseen(false)
        }
      }
    }
  }
  const hideDisplay = (e) => {
    const deleteMenu = document.querySelector(".delete-menu");
    if (deleteMenu && !deleteMenu.contains(e.target)) {
      setselecetedchat("");
    }
  };
  useEffect(() => {
    if (selecetedchat) {
      document.addEventListener('click', hideDisplay);
      return () => {
        document.removeEventListener('click', hideDisplay);
      };
    }
  }, [selecetedchat]);
  const scroll = () => {
    const component = document.querySelector(".yug")
    if (component) {
      component.scrollIntoView({ behavior: "smooth" })
    }
  }
  const closeImage = () => {
    setMessage({ message: "", image: "" });
    showImage("");
    document.querySelector("input[type='file']").value = "";
  }
  const OpenImage = (url) => {
    setimageurl(API_URL + `/uploads/tickets/${url}`);
    setshowimage(true);
  }
  const OpenChatImage = (url) => {
    setimageurl(API_URL + `/uploads/userchat/${url}`);
    setshowimage(true);
  }
  const handleInputChange = (event) => {
    const { name, value, files, type } = event.target;
    if (type === 'file') {
      setMessage((info) => ({ ...info, [name]: files[0] }));
      showImage(URL.createObjectURL(files[0]));
      scroll();
    } else {
      setMessage((info) => ({ ...info, [name]: value }));
    }
  }
  const sendMessage = async () => {
    setloader(true)
    let setImage = ""
    if (message.image) {
      const formdata = new FormData();
      formdata.append("image", message.image);
      await post(API_URL + "/uploadChatImage", formdata).then((res) => {
        showImage(res);
        setImage = res;
      }).catch((error) => {
        toast.error("cannot send image")
      })
    }
    await post(API_URL + "/sendMessage", {
      reciever: location.state.userId,
      ticket: location.state._id,
      message: message.message === "" ? setImage : message.message,
      type: message.image ? (message.image.type === "application/pdf" ? 2 : 0) : 1
    }).then(() => {
      setMessage({ message: "", image: "" });
      showImage("");
      setloader(false);
      document.querySelector("input").value = "";
      scroll();
    }).catch((error) => {
      toast.error("Cannot send message")
    })
  };
  const getMessage = async () => {
    await get(API_URL + `/getMessage?ticketId=${location.state._id}`).then((res) => {
      setHistory(res);
      scroll();
    }).catch((error) => {
      toast.error("Cannot get chat history");
    })
  };
  const deleteChat = async (id) => {
    await Delete(API_URL + `/deletemessage?id=${id}`)
      .then(() => {
        getMessage();
        setselecetedchat("")
      }).catch((error) => {
        toast.error("cannot delete message")
      })
  }
  const deleteChatForMe = async (id) => {
    await Delete(API_URL + `/deleteMessageForMe?id=${id}`)
      .then(() => {
        getMessage();
        setselecetedchat("")
      }).catch((error) => {
        toast.error("cannot delete message")
      })
  }
  const seenMessage = async () => {
    await patch(API_URL + `/seenMessage`).then(() => {
    }).catch((error) => {
      console.log(error);
      toast.error("server error")
    })
  }
  const handleEmojiSend = (event, emojiObject) => {
    setMessage((info) => ({ ...info, [message]: emojiObject.emoji }));
    setEmojiVisible(false)
  }
  useEffect(() => {
    getMessage();
    checkSeen();
    getUser();
    seenMessage();
    scroll();
    Socket.on("response", (message) => {
      getMessage();
      scroll();
      checkSeen();
      return () => {
        Socket.off("response", message)
      }
    });
  }, []);

  return (
    <div className="flex h-screen w-screen font-serif">
      <div className="w-full md:w-1/3 bg-gradient-to-b from-gray-100 to-gray-300 p-6 shadow-lg overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-700 hover:text-blue-600 transition duration-300">
            Ticket Details
          </h2>
          <button
            onClick={() => navigate("/user/tickets")}

            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-transform duration-300 transform hover:scale-105">
            Go Back
          </button>
        </div>
        <TicketDetails ticket={ticket} OpenImage={OpenImage}></TicketDetails>
      </div>
      <div className="w-full md:w-2/3 bg-white flex flex-col p-6 relative shadow-lg">
        {ticket ? (<h2 className="text-2xl text-center font-bold text-gray-700 mb-6 px-6">{ticket.reason}</ h2>) : (null)}
        <div className="flex-1 overflow-auto space-y-4">
          {history.length > 0 ? (
            history.map((chat, index) => (
              <ChatSections chat={chat} selectedchat={selecetedchat} OpenChatImage={OpenChatImage} deleteChat={deleteChat}
                deleteChatForMe={deleteChatForMe} index={index} setselecetedchat={setselecetedchat}>

              </ChatSections>
            ))
          ) : (
            <div>Nothing to show</div>
          )}
          {emojiVisible &&
            <EmojiPicker className='absolute right-0' onEmojiClick={handleEmojiSend}></EmojiPicker>
          }
          {image && (
            <div className="relative">
              <img src={image} alt="Image Preview" className="max-w-xs h-auto rounded-lg shadow-md" />
              <button
                onClick={closeImage}
                className="absolute top-0 p-2 text-white bg-black text-xl rounded-full">
                <i className="fa-regular fa-circle-xmark"></i>
              </button>
            </div>
          )}
          {showimage && (
            <Showimage imageurl={imageurl} setshowimage={setshowimage}></Showimage>
          )}
          {showseen && <div className="text-right mr-8 text-base">Seen</div>}
          <div className="yug"></div>
        </div>
        {location.state.status === 0 ? (<div className="mt-6 flex items-center">
          <i className={`fa-solid fa-plus text-2xl p-2 mr-2 text-gray-600  rounded-full cursor-pointer transition-transform duration-300 hover:bg-gray-200 hover:text-blue-500 hover:scale-110 ${message.message === "" ? "block" : "hidden"}`}
            onClick={() => document.querySelector(".fileUpload").click()}></i>
          <i className={`fa-solid fa-smile text-2xl p-2 mr-2 text-gray-600  rounded-full cursor-pointer transition-transform duration-300 hover:bg-gray-200 hover:text-blue-500 hover:scale-110 ${message.message === "" ? "block" : "hidden"}`}
            onClick={() => setEmojiVisible(true)}></i>
          <input
            onChange={handleInputChange}
            value={message.message}
            disabled={message.image}
            onKeyDown={(e) => {
              if (e.keyCode === 13 && (message.message || message.image)) {
                sendMessage();
              }
            }}
            name="message"
            type="text"
            className="flex-1 message-input border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Type your message here..."
          />
          {loader ? <div class="animate-spin inline-block size-6 border-[3px] px-1 border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
            <span class="sr-only">Loading...</span>
          </div> : <button disabled={!message.message && !message.image} onClick={sendMessage} className="bg-blue-500 text-white px-4 py-3 rounded-lg ml-4">
            Send
          </button>}
        </div>) : (null)}
        <input type='file' onChange={handleInputChange} name="image" className='hidden fileUpload'></input>
      </div>
      <style>{
        `button:disabled {
  background-color: #ccc;
}`
      }</style>
    </div>
  )
};
export default UserChats;
