import { useState, useEffect, useRef } from 'react';
import geminiService from '../apis/geminiApi';

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
        <div className="h-[90vh] flex items-center justify-center bg-gradient-to-br from-[#0a0e27] to-[#1a1d3d] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-30 z-0 bg-[size:200px_200px] bg-[image:radial-gradient(2px_2px_at_20px_30px,white,transparent),radial-gradient(2px_2px_at_60px_70px,white,transparent),radial-gradient(1px_1px_at_50px_50px,white,transparent),radial-gradient(1px_1px_at_130px_80px,white,transparent),radial-gradient(2px_2px_at_90px_10px,white,transparent)] animate-[twinkle_5s_ease-in-out_infinite]" />
            <style jsx>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.5; }
                }
                @keyframes messageSlideIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes typing {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
                    30% { transform: translateY(-10px); opacity: 1; }
                }
             `}</style>

            <div className="w-full h-full bg-[#0f1223]/60 backdrop-blur-xl flex flex-col overflow-hidden relative z-10 md:h-full">

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-lg [&::-webkit-scrollbar-thumb]:bg-indigo-500/50 [&::-webkit-scrollbar-thumb]:rounded-lg hover:[&::-webkit-scrollbar-thumb]:bg-indigo-500/70 md:p-4 md:gap-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 items-start animate-[messageSlideIn_0.3s_ease-out] ${message.role === 'user' ? 'flex-row-reverse justify-start' : ''}`}
                        >
                            {message.role === 'model' && (
                                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-xl shrink-0 md:w-8 md:h-8 md:text-base">
                                    <span>🤖</span>
                                </div>
                            )}

                            <div className={`max-w-[70%] flex flex-col gap-2 md:max-w-[85%] ${message.role === 'user' ? 'items-end' : ''}`}>
                                {message.role === 'model' && (
                                    <div className="text-xs text-slate-400 px-2">
                                        AI Assistant • {formatTime(message.timestamp)}
                                    </div>
                                )}

                                <div className={`p-4 rounded-2xl text-white leading-loose whitespace-pre-wrap break-words md:p-3 md:text-sm ${message.isError
                                    ? 'bg-red-500/20 border border-red-500/30'
                                    : message.role === 'model'
                                        ? 'bg-[#1e233c]/80 border border-white/10'
                                        : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-[0_4px_15px_rgba(59,130,246,0.3)]'
                                    }`}>
                                    {message.text}
                                </div>

                                {message.role === 'user' && (
                                    <div className="text-xs text-slate-400 px-2 text-right">
                                        Explorer • {formatTime(message.timestamp)}
                                    </div>
                                )}
                            </div>

                            {message.role === 'user' && (
                                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-xl shrink-0 md:w-8 md:h-8 md:text-base">
                                    <span>👤</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 items-start animate-[messageSlideIn_0.3s_ease-out]">
                            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-xl shrink-0 md:w-8 md:h-8 md:text-base">
                                <span>🤖</span>
                            </div>
                            <div className="max-w-[70%] flex flex-col gap-2 md:max-w-[85%]">
                                <div className="text-xs text-slate-400 px-2">AI Assistant</div>
                                <div className="p-4 px-6 rounded-2xl bg-[#1e233c]/80 border border-white/10 text-white md:p-4">
                                    <div className="flex gap-1.5 items-center">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-[typing_1.4s_infinite]"></span>
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-[typing_1.4s_infinite_0.2s]"></span>
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-[typing_1.4s_infinite_0.4s]"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {messages.length <= 1 && (
                    <div className="px-8 pb-4 flex flex-wrap gap-3 md:px-4 md:pb-4">
                        {suggestedQuestions.map((question, index) => (
                            <button
                                key={index}
                                className="px-5 py-3 bg-indigo-500/15 border border-indigo-500/30 rounded-full text-[#c7d2fe] text-sm cursor-pointer transition-all duration-300 flex items-center gap-2 hover:bg-indigo-500/25 hover:border-indigo-500/50 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none md:px-4 md:py-2.5 md:text-xs"
                                onClick={() => handleSuggestedQuestion(question)}
                                disabled={isLoading}
                            >
                                <span className="text-base md:text-sm">💡</span>
                                {question}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Area */}
                <div className="p-6 px-8 bg-[#1e233c]/80 border-t border-indigo-500/20 md:p-4 md:px-6">
                    <div className="flex gap-3 items-center bg-[#0f1223]/60 border border-white/10 rounded-xl p-2 transition-all duration-300 focus-within:border-indigo-500/50 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]">
                        <input
                            ref={inputRef}
                            type="text"
                            className="flex-1 bg-transparent border-none outline-none text-white text-base p-2 placeholder:text-slate-500"
                            placeholder="Hỏi trợ lý AI về vũ trụ..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />

                        <button
                            className="w-10 h-10 border-none bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xl cursor-pointer rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0 hover:from-indigo-600 hover:to-violet-600 hover:scale-105 hover:shadow-[0_4px_15px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                            onClick={() => handleSendMessage()}
                            disabled={!inputMessage.trim() || isLoading}
                        >
                            <span>➤</span>
                        </button>
                    </div>

                    <p className="text-xs text-slate-500 text-center mt-3">
                        Planet8 AI có thể mắc sai sót. Hãy kiểm tra thông tin quan trọng.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;
