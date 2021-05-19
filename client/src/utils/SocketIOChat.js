import React, { useEffect, useRef, useState} from 'react';
import { io } from "socket.io-client";

const SERVER_URL = 'http://localhost:5000'

const SocketIoChat = (roomId) => {
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef();
    socket.current = io(SERVER_URL, { query: { roomId }})


    //subscribe for messages
    useEffect(() => {
        socket.current.on('message', (msg) => {
            setMessages(prev => [msg, ...prev])
        })

        socket.current.on('connected', (msg) => {
            setMessages(prev => [msg, ...prev])
        })
    }, [socket]);


    //connecting
    function connect() {
        setConnected(true)
        const message = {
            username,
            id: Date.now(),
            event: 'connected'
        }
        socket.current.emit('connected', message)
    }

    //sending message
    function sendMessage() {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message',
            date: new Date()
        }
        socket.current.emit('message', message)
        setValue('')
    }

    //disconnecting
    socket.current.on('disconnected', () => {
        setConnected(false)
    })
    //catch error
    socket.current.on('error', () => {
        console.log('error with socket')
    })


    // user not logged
    if(!connected) {
        return (
            <div className='center'>
                <div className='form'>
                    <input value={username} onChange={e => setUsername(e.target.value)} type='text' placeholder='Введите имя пользователя'/>
                    <button onClick={connect} >Войти</button>
                </div>
            </div>
        )
    }

    // user logged
    return (
        <div className="center">
            <div>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text"/>
                    <button onClick={sendMessage}>Отправить</button>
                </div>

                <div className="messages">
                    {messages.map(mess =>
                        <div key={mess.id}>
                            {mess.event === 'connection'
                                ? <div className='connection_message'>
                                    Пользователь {mess.username} подключился
                                </div>
                                : <div className='message'>
                                    [{mess.date.slice(11,19)}] {mess.username}: {mess.message}
                                </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SocketIoChat;
