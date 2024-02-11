import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./chart.css";
import { allContacts } from "../../utils/apiEndpoints";
import { useNavigate } from "react-router-dom";
import { Contacts } from "../../components/contacts/Contacts";
import { Welcome } from "../../components/welcome";
import { ChatContainer } from "../../components/chatContainer";
import { baseUrl } from "../../utils/apiEndpoints";
import { io } from "socket.io-client";

export const Chat = () => {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const handleChat = (chat) => {
    setCurrentChat(chat);
  };
  const navigate = useNavigate();
  const getContacts = async () => {
    const currentUser = JSON.parse(sessionStorage.getItem("chat-app-user"));
    if (!currentUser) {
      navigate("/login");
    } else {
      setCurrentUser(currentUser);
      if (!currentUser.isAvatarImageSet) {
        navigate("/setAvatar");
      } else {
        const { data } = await axios.get(`${allContacts}/${currentUser._id}`);
        setContacts(data.users);
      }
    }
  };
  useEffect(() => {
    if (currentUser) {
      socket.current = io(baseUrl);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);
  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className="container">
      <div className="innerContainer">
        {contacts && currentUser ? (
          <>
            <Contacts
              contacts={contacts}
              currentUser={currentUser}
              changeChat={handleChat}
            />
            {!currentChat ? (
              <Welcome currentUser={currentUser} />
            ) : (
              <ChatContainer
                currentChat={currentChat}
                currentUser={currentUser}
                socket={socket}
              />
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
