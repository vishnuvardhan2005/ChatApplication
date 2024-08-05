import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Ensure this matches the backend port

function App() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        socket.on('connect', () => {
            setUserId(socket.id);
        });

        socket.on('message', data => {
            setMessages(prevMessages => [...prevMessages, data]);
        });

        socket.on('user_connected', data => {
            console.log('User connected:', data.user_id);
        });

        socket.on('user_disconnected', data => {
            console.log('User disconnected:', data.user_id);
        });
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            const msgData = { msg: message, user_id: userId };
            socket.emit('message', message);
            setMessages(prevMessages => [...prevMessages, msgData]); // Add message to own chat history
            setMessage('');
        }
    };

    return (
        <div>
            <h1>Chat Application</h1>
            <div>
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        style={{ 
                            textAlign: msg.user_id === userId ? 'right' : 'left',
                            color: msg.user_id === userId ? 'blue' : 'black'
                        }}
                    >
                        <strong>{msg.user_id === userId ? 'Me' : 'Other'}:</strong> {msg.msg}
                    </div>
                ))}
            </div>
            <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default App;