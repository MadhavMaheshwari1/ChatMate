import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState([]);
    const [User, setUser] = useState();
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (userInfo && userInfo.token) {
            const decodedToken = jwtDecode(userInfo.token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                // Token is expired
                localStorage.removeItem("userInfo");
                navigate("/");
            } else {
                setUser(userInfo);
                navigate("/Chats");
            }
        } else {
            navigate("/");
        }
    }, [navigate]);

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                User,
                setUser,
                notification,
                setNotification,
                chats,
                setChats,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;
