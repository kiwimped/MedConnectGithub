import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatbotIcon from "../../components/ChatbotIcon";
import { CaretDown } from "phosphor-react";
import styles from "./AI.module.css";
import ChatForm from "../../components/ChatForm";
import ChatMessage from "../../components/ChatMessage";

export const AI = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

  useEffect(() => {
    if (openaiApiKey) {
      console.log("Using OpenAI API Key:", openaiApiKey);
    }
  }, [openaiApiKey]); // Run once when the component mounts

  // Send chat history to the backend and get the bot's response
  const generateBotResponse = async (history) => {
    try {
      // Sending the chat messages to the backend server
      const response = await axios.post("http://localhost:8000/api/chat", {
        messages: history, // The chat history you want to send
      });

      // Get the reply from the backend response
      const reply = response.data.reply;

      // Update chatHistory with the model's reply
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "model", text: reply },
      ]);
    } catch (error) {
      console.error("Error getting response from backend:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatbotPopup}>
        <div className={styles.chatHeader}>
          <div className={styles.headerInfo}>
            <ChatbotIcon />
            <h2 className={styles.logoText}>ChatBot</h2>
          </div>
          <button className={styles.toggleButton}>
            <CaretDown size={32} />
          </button>
        </div>

        <div className={styles.chatBody}>
          {/* Default bot message */}
          <div className={`${styles.message} ${styles.botMessage}`}>
            <p className={styles.messageText}>
              Hey there :) <br /> How can I help you?
            </p>
          </div>

          {/* Render chat history */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className={styles.chatFooter}>
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};
