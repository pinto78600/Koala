import { useContext, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { UidContext } from "./AppContext";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  const uid = useContext(UidContext);

  useEffect(() => {
    socketRef.current = socketIOClient(process.env.REACT_APP_API_URL, {
      query: { roomId },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
  
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === uid,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, uid]);

  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: uid,
      roomId
    });
  };

  return { messages, sendMessage };
};

export default useChat;