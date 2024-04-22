import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io from "socket.io-client";
import { AuthContext } from "./authContext";
import { client, serverAddress } from "../configs/axios";
import { useNavigation } from "@react-navigation/native";
import { useNotification } from "./Notification";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { sendNotification } = useNotification();
  const [chatRooms, setChatRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [recepient, setRecepient] = useState(null);
  const [currentChatRoom, setCurrentChatRoom] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState(null);

  useEffect(() => {
    const newSocket = io(serverAddress, {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      newSocket.emit("addNewUser", user?._id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.emit("addNewUser", user?._id);
      socket.on("onlineUsers", (users) => {
        setOnlineUsers(users);
      });
    }
    return () => {
      socket?.off("onlineUsers");
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.emit("sendMessage", { newMessage, recepient });
    }
  }, [newMessage, recepient, socket]);
  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        if (message.chatId !== currentChatRoom) return;
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log("new message", message);
        setReceivedMessage(message);
      };

      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [socket, currentChatRoom, setMessages, setReceivedMessage]);

  useEffect(() => {
    if (receivedMessage === null) return;
    const newChatRooms = chatRooms.map((chatRoom) => {
      if (chatRoom._id === receivedMessage?.chatId) {
        return {
          ...chatRoom,
          lastMessage: receivedMessage?.message,
          lastMessageTime: receivedMessage?.createdAt,
        };
      }
      return chatRoom;
    });
    setChatRooms(newChatRooms);
  }, [receivedMessage]);

  const getChatRooms = async () => {
    try {
      const response = await client.get("/chats");
      setChatRooms(response.data.documents);
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

      response && getChatRooms();
      response && navigation.navigate("Chat");
    } catch (err) {
      console.log(err.response);
    }
  };
  const getMessages = async (chatId, ref) => {
    try {
      const response = await client.get(`/chats/messages/${chatId}`);
      setMessages(response.data.documents);
      setLoading(false);
      ref?.current?.scrollToEnd({
        behavior: "smooth",
        block: "end",
        animated: "true",
      });
    } catch (err) {
      console.log(err.response);
      setLoading(false);
    }
  };
  const addMessage = async (chatId, message, ref, recepient) => {
    try {
      setSendingMessage(true);
      const response = await client.post("/chats/messages/add", {
        chatId,
        sender: user._id,
        message,
      });

      setMessages((prevMessages) => [...prevMessages, response.data.document]);

      setNewMessage(response.data.document);
      console.log(recepient?._id, "recepient");
      setRecepient(recepient?._id);
      ref.current.scrollToEnd({
        behavior: "smooth",
        block: "end",
        animated: "true",
      });
      response && setSendingMessage(false);
      response &&
        sendNotification({
          title: "New message from " + user?.name,
          body: message,
          data: {
            chatId,
            sender: user._id,
            message,
          },
          to: recepient?.expoPushToken,
        });
      const newChatRooms = chatRooms.map((chatRoom) => {
        if (chatRoom._id === response?.data?.document?.chatId) {
          return {
            ...chatRoom,
            lastMessage: response?.data?.document?.message,
            lastMessageTime: response?.data?.document?.createdAt,
          };
        }
        return chatRoom;
      });
      setChatRooms(newChatRooms);
    } catch (err) {
      console.log(err.response);
      setSendingMessage(false);
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
        sendingMessage,
        onlineUsers,
        setCurrentChatRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
