import React, { useState, useEffect } from 'react';
import axios from 'axios';
import homeStyles from "../../styles/HomePage.module.css";
import chatStyles from "../../styles/InsuranceChat.module.css";
import HomePageNavbar from "../HomePage/components/HomePageNavbar";

const InsuranceChat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatStarted, setChatStarted] = useState(false);

    const API_BASE_URL = 'http://localhost:4000/api/insurance';

    const formatResponse = (responseData) => {
        try {
            const data = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;
            let formattedMessage = '';

            // Add acknowledgment if present
            if (data.acknowledgment) {
                formattedMessage += data.acknowledgment + '\n\n';
            }

            // Add current question if present
            if (data.currentQuestion) {
                formattedMessage += data.currentQuestion;
            }

            // Add recommendations if present
            if (data.recommendations) {
                formattedMessage += '\n\nRecommended Insurance Options:\n';
                data.recommendations.forEach(option => {
                    formattedMessage += `\n📋 ${option.name}\n`;
                    formattedMessage += `${option.available ? '✅' : '❌'} ${option.reason}\n`;
                    if (option.available) {
                        formattedMessage += `🛡️ Coverage: ${option.coverage.join(', ')}\n`;
                        formattedMessage += `💰 ${option.price}\n`;
                    }
                });
            }

            return formattedMessage.trim();
        } catch (error) {
            console.error('Error formatting response:', error);
            return responseData;
        }
    };

    const startChat = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/start`);
            const formattedMessage = formatResponse(response.data.message);
            setMessages([{ role: 'assistant', content: formattedMessage }]);
            setChatStarted(true);
        } catch (error) {
            console.error('Error starting chat:', error);
            setMessages([{ role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        }
        setIsLoading(false);
    };

    const sendMessage = async () => {
        if (!userInput.trim()) return;

        const newMessages = [...messages, { role: 'user', content: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/message`, {
                messageHistory: newMessages,
                userInput: userInput
            });
            const formattedMessage = formatResponse(response.data.message);
            setMessages([...newMessages, { role: 'assistant', content: formattedMessage }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!chatStarted) {
            startChat();
        }
    }, []);

    return (
        <div className={homeStyles.homeContentContainer}>
            <HomePageNavbar />  
            <div className={chatStyles.chatContainer}>
                <div className={chatStyles.messagesContainer}>
                    <div className={chatStyles.messagesList}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={message.role === 'user' ? chatStyles.userMessage : chatStyles.assistantMessage}
                            >
                                {message.content.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </div>
                        ))}
                        {isLoading && (
                            <div className={chatStyles.loadingMessage}>
                                Thinking...
                            </div>
                        )}
                    </div>
                </div>
                <div className={chatStyles.inputContainer}>
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                        placeholder="Type your message..."
                        className={chatStyles.input}
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isLoading}
                        className={chatStyles.sendButton}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InsuranceChat;
