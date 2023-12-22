import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io from "socket.io-client";
import { AuthContext } from "./authContext";
import { client } from "../configs/axios";
import { useNavigation } from "@react-navigation/native";

export const ChatContext = createContext();

const newSocket = io("http://localhost:4000");

const ChatProvider = ({ children }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [chatRooms, setChatRooms] = useState([{ members: [] }]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [recepient, setRecepient] = useState(null);

  useEffect(() => {
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [newSocket, user]);

  useEffect(() => {
    if (socket) {
      socket.emit("addNewUser", user?._id);
      socket.on("onlineUsers", (users) => {
        setOnlineUsers(users);
        console.log("running online users", users);
      });
    }
    return () => socket?.off("onlineUsers");
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.emit("sendMessage", { newMessage, recepient });
      socket.on("newMessage", (message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
    return () => socket?.off("newMessage");
  }, [socket, newMessage, recepient]);

  const getChatRooms = async () => {
    try {
      console.log("running");
      const response = await client.get("/chats");
      setChatRooms(response.data.documents);
      console.log(response.data.documents, "chatRooms");
    } catch (error) {
      console.log(error.response);
      console.log("error message");
    }
  };

  const createChatRoom = async (listingId, recepientId) => {
    try {
      const response = await client.post(
        `/listings/${listingId}/chats/create-room`,
        {
          user1: recepientId,
        }
      );
      setChatRooms([...chatRooms, response.data.document]);
      navigation.navigate("Chat");
    } catch (err) {
      console.log(err.response);
    }
  };
  const getMessages = async (chatId, ref) => {
    try {
      const response = await client.get(`/chats/messages/${chatId}`);
      setMessages(response.data.documents);
      setLoading(false);
      ref.current.scrollToEnd({
        behavior: "smooth",
        block: "end",
        animated: "true",
      });
    } catch (err) {
      console.log(err.response);
      setLoading(false);
    }
  };
  const addMessage = async (chatId, message, ref, recepientId) => {
    try {
      const response = await client.post("/chats/messages/add", {
        chatId,
        sender: user._id,
        message,
      });
      setMessages([...messages, response.data.document]);
      setNewMessage(response.data.document);
      setRecepient(recepientId);
      ref.current.scrollToEnd({
        behavior: "smooth",
        block: "end",
        animated: "true",
      });
      console.log(recepientId, "recepient");
    } catch (err) {
      console.log(err.response);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        loading,
        chatRooms,
        getChatRooms,
        createChatRoom,
        messages,
        getMessages,
        addMessage,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
