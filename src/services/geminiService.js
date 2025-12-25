const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

class GeminiService {
    constructor() {
        this.conversationHistory = [];
        this.systemPrompt = `Bạn là một trợ lý AI chuyên về thiên văn học và các hành tinh trong hệ mặt trời.

Nhiệm vụ của bạn:
- Trả lời các câu hỏi về hành tinh, mặt trăng, và các thiên thể trong hệ mặt trời một cách chính xác, dễ hiểu và thú vị.
- Sử dụng ngôn ngữ tiếng Việt, thân thiện và phù hợp với người học.
- Giải thích bằng các ví dụ sinh động để dễ hình dung.
- Nếu được hỏi về các chủ đề KHÔNG liên quan đến hành tinh hoặc thiên văn học, hãy lịch sự từ chối và khuyến khích người dùng hỏi về hệ mặt trời.

Hãy trả lời ngắn gọn (2–4 câu) trừ khi người dùng yêu cầu giải thích chi tiết.`;

        this.initializeConversation();
    }

    initializeConversation() {
        this.conversationHistory = [
            {
                role: 'user',
                parts: [{ text: this.systemPrompt }]
            },
            {
                role: 'model',
                parts: [{ text: 'Tôi đã sẵn sàng trả lời các câu hỏi về hành tinh và hệ mặt trời.' }]
            }
        ];
    }

    async sendMessage(userMessage) {
        if (!API_KEY || API_KEY === 'your_api_key_here') {
            throw new Error('Chưa cấu hình GEMINI_API_KEY! Vui lòng thêm API key vào file .env');
        }

        try {
            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });

            // Prepare request body
            const requestBody = {
                contents: this.conversationHistory,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                }
            };

            // Call Gemini API
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData?.error?.message || 'Unknown error';

                if (errorMessage.includes('API_KEY') || errorMessage.includes('API key')) {
                    throw new Error('❌ Lỗi: API key không hợp lệ. Vui lòng kiểm tra lại.');
                } else {
                    throw new Error(`⚠️ Đã xảy ra lỗi API: ${errorMessage}`);
                }
            }

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
                const content = data.candidates[0].content;
                const text = content.parts[0].text;

                // Add AI response to history
                this.conversationHistory.push(content);

                return text;
            } else {
                return 'Xin lỗi, tôi chưa thể trả lời câu hỏi này.';
            }
        } catch (error) {
            if (error.message.includes('❌') || error.message.includes('⚠️')) {
                throw error;
            }

            if (error.message.includes('fetch') || error.message.includes('network')) {
                throw new Error('🌐 Lỗi: Không có kết nối internet. Vui lòng kiểm tra mạng.');
            } else {
                throw new Error(`⚠️ Đã xảy ra lỗi: ${error.message}`);
            }
        }
    }

    resetChat() {
        this.initializeConversation();
    }

    getWelcomeMessage() {
        return `Xin chào! 🚀 Tôi là trợ lý AI chuyên về các hành tinh trong hệ mặt trời.

Bạn có thể hỏi tôi về:
• Các hành tinh
• Các mặt trăng
• Mặt Trời
• Các hiện tượng thiên văn

Hãy bắt đầu bằng một câu hỏi nhé!`;
    }

    getSuggestedQuestions() {
        return [
            'Hành tinh nào lớn nhất trong hệ mặt trời?',
            'Sao Hỏa có màu đỏ vì sao?',
            'Sao Thổ có bao nhiêu vành đai?',
            'Trái Đất cách Mặt Trời bao xa?',
        ];
    }
}

export default new GeminiService();
