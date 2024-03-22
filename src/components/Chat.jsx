import style from './css/chat.module.css';
import { IoArrowBack } from "react-icons/io5";
import { TbSend } from "react-icons/tb";
import { useParams, useNavigate } from 'react-router-dom';
import profileImg from '../images/profile.jpg';
import { useState, useEffect, useRef } from 'react';
import io from "socket.io-client";
import Swal from 'sweetalert2';

const { ipcRenderer } = window.require('electron');


function ShowMessage({ messages }) {
  return (
    <div>
      {
        messages.map((msg, index) => (
          <div key={index} className={style.messageContainer}>
            <img src={profileImg} alt="" className={style.profileImg} />
            <div className={style.chat}>
              <span className={style.chatName}>{msg.userId}</span>
              <span className={style.chatText}>{msg.text}</span>
            </div>
          </div>
        ))
      }
    </div>
  );
}

function getChatId() {
  const length = 10;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

export default function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [socket, setSocket] = useState('');
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef();

  useEffect(() => {
    ipcRenderer.send('REQ_TOKEN');

    const getTokenListener = (evt, token) => {
      const socket = io(`http://localhost?authorization=${token}`, {
        transports: ["websocket"]
      });

      setToken(token);
      setSocket(socket);

      socket.on('MSG', (data) => {
        Swal.fire(data.text);
        ipcRenderer.send('SAVE_MSG', data);

        setMessages(prevMessages => [...prevMessages, data]);
      });

      socket.on('connection', () => {

      });

      socket.on('disconnect', () => {
        Swal.fire('서버와의 연결이 종료되었습니다');
      })
    }

    ipcRenderer.once('TOKEN_RES', getTokenListener);

    // 쓸때는 userId가 아닌 channelId에 따라 보내야함, 현재도 내가 보낸 채팅만 저장됨
    Swal.fire(`상대 userId: ${userId}`);

    ipcRenderer.send("GET_CHATLIST", '4flos6');

    const listener = (evt, data) => {
      const newMessages = [];

      for (let chatId in data) {
        const chat = data[chatId];
        newMessages.push(chat);
      }

      setMessages(prevMessages => [...prevMessages, ...newMessages]);

      <ShowMessage messages={messages} />
    }

    ipcRenderer.once('CHATLIST', listener);

    return () => {
      ipcRenderer.removeListener('CHATLIST', listener);
      ipcRenderer.removeListener('TOKEN_RES', getTokenListener);
    };
  }, []);

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);


  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost/talk/friends/${userId}`, {
        headers: {
          Authorization: token
        }
      });

      const data = await res.json();

      if (data.success) {
        setName(data.result.nickname);
      } else {
        setName('(정보가 없습니다)');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData(); // 비동기 함수 호출


  const handleOnKeyPress = e => {
    if (e.key === 'Enter') {
      sendMessage(message);
    }
  };

  const sendMessage = async (message) => {
    if (message == "") return;
    setMessage('');
    setSocket(socket);

    if (token) {
      const userId = JSON.parse(window.atob(token.split('.')[1])).userId

      const chat = {
        channelId: 'abcd',
        chatId: getChatId(),
        userId: userId,
        text: message,
        timeStamp: new Date()
      }

      socket.emit("JOIN", 'abcd');
      socket.emit("WRITE", chat);

      ipcRenderer.send('SAVE_MSG', chat);

      const newMessage = {
        text: message,
        userId: '나' // 임시(원래 sender)
      }
      setMessages([
        ...messages,
        newMessage
      ]);
    } else {
      Swal.fire('error');
    }
  }

  return (
    <div>
      <div className={style.header}>
        <IoArrowBack onClick={() => navigate('/main')} className={style.icon} />
        <span className={style.name}>{name}</span>
      </div>
      <div className="chat_scroll_box" ref={chatContainerRef}>
        <ShowMessage messages={messages} />
      </div>
      <div className={style.chatContainer}>
        <input
          type="text"
          id={message}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={style.inputBox}
          placeholder="Type a message..."
          onKeyPress={handleOnKeyPress}
        />
        <TbSend onClick={() => sendMessage(message)} className={{ fontSize: '30px', marginLeft: '10px' }} />
      </div>
    </div>
  );
}