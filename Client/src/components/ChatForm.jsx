import React, { useState } from "react";
import styles from "./ChatForm.module.css";
import { ArrowElbowDownRight } from "phosphor-react";

const ChatForm = ({ chatHistory,setChatHistory,generateBotResponse }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatHistory((prevHistory) => [
      ...prevHistory,
      { role: "user", text: message },
    ]);

    setTimeout(() => {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { role: "model", text: "Thinking" },
        ]);
      
        generateBotResponse([...chatHistory, { role: "user", text: message }]);
      }, 600);
      

    setMessage(""); // Clear input after sending

  };

  return (
    <form className={styles.chatForm} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Message..."
        className={styles.messageInput}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button type="submit" className={styles.sendButton}>
        <ArrowElbowDownRight size={32} />
      </button>
    </form>
  );
};

export default ChatForm;
