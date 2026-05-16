import { useState, useRef, useEffect } from 'react';
import { 
    Box, Paper, Typography, TextField, IconButton, Fab, Avatar, CircularProgress, Fade 
} from '@mui/material';
import { MessageOutlined, CloseOutlined, SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';

// API KEY CỦA BẠN 
//const GEMINI_API_KEY = 'AIzaSyCZ7tajeqvxOaO9pxjjSWQWhNhfctwUei8';
const GEMINI_API_KEY = 'AIzaSyAadoGsdbddCnKxcWlvHwwwbjVYZJLqfbo';

export default function AIChatBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Chào bạn! Mình là trợ lý AI của RainbowFood 🍔. Mình có thể giúp gì cho bạn hôm nay?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

 const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        const newMessages = [...messages, { sender: 'user', text: userMessage }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const systemContext = "Bạn là một nhân viên chăm sóc khách hàng thân thiện của nhà hàng thức ăn nhanh tên là RainbowFood. Hãy trả lời ngắn gọn, nhiệt tình và lịch sự. Câu hỏi của khách hàng là: ";
            
            // ĐÃ ĐỔI SANG MODEL GEMINI-1.5-FLASH (Ổn định và ít bị lỗi High Demand hơn)
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemContext + userMessage }] }]
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                console.error("Chi tiết lỗi từ Google:", data);
                // Xử lý riêng lỗi quá tải của Google
                if (data.error?.message?.includes("high demand") || data.error?.code === 503) {
                    throw new Error("Hệ thống AI đang quá tải do có nhiều lượt truy cập. Bạn vui lòng thử lại sau vài giây nhé!");
                }
                throw new Error(data.error?.message || 'Lỗi kết nối API');
            }

            if (data.candidates && data.candidates.length > 0) {
                const botReply = data.candidates[0].content.parts[0].text;
                setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
            } else {
                setMessages(prev =>[...prev, { sender: 'bot', text: 'Hệ thống AI đang bận, thử lại sau nhé!' }]);
            }
        } catch (error) {
            console.error("Lỗi:", error);
            // Hiển thị thông báo lỗi thân thiện ra màn hình chat
            setMessages(prev =>[...prev, { 
                sender: 'bot', 
                text: error.message.includes("quá tải") ? error.message : `Lỗi kết nối: ${error.message}. Xin kiểm tra lại mạng.` 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 9999 }}>
            <Fade in={isOpen}>
                <Paper 
                    elevation={12} 
                    sx={{ 
                        position: 'absolute', bottom: 70, right: 0, 
                        width: { xs: 320, sm: 380 }, height: 500, 
                        display: isOpen ? 'flex' : 'none', flexDirection: 'column', 
                        borderRadius: 4, overflow: 'hidden', border: '1px solid #f0f0f0'
                    }}
                >
                    <Box sx={{ bgcolor: '#FF512F', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(45deg, #FF512F 0%, #F09819 100%)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 32, height: 32 }}>
                                <RobotOutlined />
                            </Avatar>
                            <Typography variant="subtitle1" fontWeight="bold">Rainbow AI</Typography>
                        </Box>
                        <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                            <CloseOutlined />
                        </IconButton>
                    </Box>

                    <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#fdfdfd' }}>
                        {messages.map((msg, idx) => (
                            <Box key={idx} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 1 }}>
                                {msg.sender === 'bot' && (
                                    <Avatar sx={{ bgcolor: '#f0f0f0', color: '#FF512F', width: 28, height: 28 }}><RobotOutlined style={{ fontSize: '14px' }} /></Avatar>
                                )}
                                
                                <Box sx={{ 
                                    maxWidth: '75%', p: 1.5, borderRadius: 2,
                                    bgcolor: msg.sender === 'user' ? '#fff0e6' : '#f5f5f5',
                                    color: msg.sender === 'user' ? '#d43b11' : '#333',
                                    border: msg.sender === 'user' ? '1px solid #ffe0cc' : '1px solid #eaeaea',
                                    borderBottomRightRadius: msg.sender === 'user' ? 4 : 16,
                                    borderBottomLeftRadius: msg.sender === 'bot' ? 4 : 16,
                                }}>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                                        {msg.text}
                                    </Typography>
                                </Box>

                                {msg.sender === 'user' && (
                                    <Avatar sx={{ bgcolor: '#ffe0cc', color: '#d43b11', width: 28, height: 28 }}><UserOutlined style={{ fontSize: '14px' }} /></Avatar>
                                )}
                            </Box>
                        ))}
                        {isLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ bgcolor: '#f0f0f0', color: '#FF512F', width: 28, height: 28 }}><RobotOutlined style={{ fontSize: '14px' }} /></Avatar>
                                <CircularProgress size={20} sx={{ color: '#FF512F' }} />
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    <Box sx={{ p: 1.5, borderTop: '1px solid #f0f0f0', bgcolor: 'white', display: 'flex', gap: 1 }}>
                        <TextField 
                            fullWidth placeholder="Nhập tin nhắn..." variant="outlined" size="small"
                            value={input} onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => { if(e.key === 'Enter') handleSend(); }}
                            disabled={isLoading}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
                        />
                        <IconButton onClick={handleSend} disabled={isLoading || !input.trim()} sx={{ bgcolor: '#FF512F', color: 'white', '&:hover': { bgcolor: '#d43b11' } }}>
                            <SendOutlined size="small" />
                        </IconButton>
                    </Box>
                </Paper>
            </Fade>

            <Fab 
                color="primary" 
                aria-label="chat" 
                onClick={() => setIsOpen(!isOpen)}
                sx={{ 
                    background: 'linear-gradient(45deg, #FF512F 0%, #F09819 100%)',
                    boxShadow: '0 8px 24px rgba(255, 81, 47, 0.4)',
                    width: 60, height: 60,
                    transition: 'transform 0.3s ease',
                    transform: isOpen ? 'scale(0.8)' : 'scale(1)',
                    '&:hover': { transform: 'scale(1.1)' }
                }}
            >
                {isOpen ? <CloseOutlined style={{ fontSize: '24px' }} /> : <MessageOutlined style={{ fontSize: '24px' }} />}
            </Fab>
        </Box>
    );
}