import React from 'react'
import styles from "./ChatMessage.module.css";

import ChatbotIcon from './ChatbotIcon';

const ChatMessage = ({chat}) =>{
    return(
        <div className={`${styles.message} ${chat.role === "model" ? styles.botMessage : styles.userMessage}`}>
          {chat.role === "model" && <ChatbotIcon/>}
          
          <p className={styles.messageText}>
            {chat.text}
          </p>
        </div>
    )
}

export default ChatMessage