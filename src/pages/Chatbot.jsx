import { useState, useEffect, useRef } from 'react';
import geminiService from '../services/geminiService';
import './Chatbot.css';

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // Show welcome message on first load
        const welcomeMessage = {
            id: Date.now(),
            role: 'model',
            text: geminiService.getWelcomeMessage(),
            timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (messageText = null) => {
        const textToSend = messageText || inputMessage.trim();

        if (!textToSend || isLoading) return;

        // Clear input
        setInputMessage('');
        setError(null);

        // Add user message
        const userMessage = {
            id: Date.now(),
            role: 'user',
            text: textToSend,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);

        // Show loading state
        setIsLoading(true);

        try {
            // Get AI response
            const response = await geminiService.sendMessage(textToSend);

            // Add AI message
            const aiMessage = {
                id: Date.now() + 1,
                role: 'model',
                text: response,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.message || 'Đã xảy ra lỗi khi gửi tin nhắn');

            // Add error message
            const errorMessage = {
                id: Date.now() + 1,
                role: 'model',
                text: err.message || 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.',
                timestamp: new Date(),
                isError: true,
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSuggestedQuestion = (question) => {
        handleSendMessage(question);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const suggestedQuestions = geminiService.getSuggestedQuestions();

    return (
        <div className="chatbot-page">
            <div className="chatbot-container">

                {/* Messages Area */}
                <div className="messages-area">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message-wrapper ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
                        >
                            {message.role === 'model' && (
                                <div className="message-avatar">
                                    <span>🤖</span>
                                </div>
                            )}

                            <div className="message-content">
                                {message.role === 'model' && (
                                    <div className="message-sender">
                                        AI Assistant • {formatTime(message.timestamp)}
                                    </div>
                                )}

                                <div className={`message-bubble ${message.isError ? 'error-message' : ''}`}>
                                    {message.text}
                                </div>

                                {message.role === 'user' && (
                                    <div className="message-time">
                                        Explorer • {formatTime(message.timestamp)}
                                    </div>
                                )}
                            </div>

                            {message.role === 'user' && (
                                <div className="message-avatar user-avatar">
                                    <span>👤</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message-wrapper ai-message">
                            <div className="message-avatar">
                                <span>🤖</span>
                            </div>
                            <div className="message-content">
                                <div className="message-sender">AI Assistant</div>
                                <div className="message-bubble loading-bubble">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {messages.length <= 1 && (
                    <div className="suggested-questions">
                        {suggestedQuestions.map((question, index) => (
                            <button
                                key={index}
                                className="suggested-question-chip"
                                onClick={() => handleSuggestedQuestion(question)}
                                disabled={isLoading}
                            >
                                <span className="chip-icon">💡</span>
                                {question}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Area */}
                <div className="input-area">
                    <div className="input-container">
                        <input
                            ref={inputRef}
                            type="text"
                            className="message-input"
                            placeholder="Hỏi trợ lý AI về vũ trụ..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />

                        <button
                            className="send-button"
                            onClick={() => handleSendMessage()}
                            disabled={!inputMessage.trim() || isLoading}
                        >
                            <span>➤</span>
                        </button>
                    </div>

                    <p className="input-disclaimer">
                        Planet8 AI có thể mắc sai sót. Hãy kiểm tra thông tin quan trọng.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;
