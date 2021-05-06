import React, { useContext, useEffect, useState } from "react";
import useChat from "../useChat";
import { UidContext } from "../AppContext";
import { timestampParser } from "../Utils";

const ChatRoom = ({roomChat, setLoadMessages }) => {
  const { messages, sendMessage } = useChat(roomChat.data[0]._id);
  const [newMessage, setNewMessage] = useState("");

  const uid = useContext(UidContext)

  const handleSendMessage = () => {
    if(newMessage !== "" ) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };
  
  
  const scrollToBottom = () => {
    const containerWindow = document.getElementsByClassName('messages-container');
    containerWindow[0].scrollTop = containerWindow[0].scrollHeight
  }
  
  useEffect(() => {
    scrollToBottom()
    
  }, [messages])

  

  return (
    <div className="chat-room-container">
      <div className="messages-container">
        <ol className="messages-list">
          { roomChat.dataLength !== roomChat.data[0].messages.length && (
            <button onClick={e => setLoadMessages(true)} >Recharger</button>
          )}
          { 
            roomChat.data[0].messages.map((message, i) => (
              <>
                <li
                  key={i}
                  className={`message-item ${
                    message.senderId ===  uid ? "my-message" : "received-message"
                  }`}
                  >
                  <p>{timestampParser(message.timestamp)}</p>
                  {message.body}
                </li>
              </>

            ))
          }
          {
            messages.map((message, i) => (
              <li
                key={i}
                className={`message-item ${
                  message.ownedByCurrentUser ? "my-message" : "received-message"
                }`}
              >
                {message.body}
              </li>
            ))
          }
        </ol>
      </div>
      <div className='footer-btn'>
        <textarea
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Ecrire votre message..."
          className="new-message-input-field"
        />
        <button onClick={handleSendMessage} className="send-message-button">
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;