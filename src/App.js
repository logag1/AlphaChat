import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import './public.css';
import Login from './components/Login';
import Main from './components/Main';
import Chat from './components/Chat';
import Titlebar from './components/Titlebar';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <BrowserRouter>
        <Titlebar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/main" element={<Main />} />
          <Route path="/chat/:userId" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;