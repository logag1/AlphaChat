import style from './css/titlebar.module.css';
import React from 'react';
import { VscChromeMinimize } from "react-icons/vsc";
import { IoCloseOutline } from "react-icons/io5";
import Swal from 'sweetalert2';

const { ipcRenderer } = window.require('electron');

export default function Titlebar() {
  const handleMinimize = () => {
    ipcRenderer.send('MINIMIZE');
  };

  const handleClose = () => {
    ipcRenderer.send('CLOSE');
  };

  return (
    <div className={style.titleBar}>
      <div className={style.logoContainer}>
        <span className={style.lightLogo}>Alpha</span>
        <span style={{ fontSize: '20px' }}>Chat</span>
      </div>
      <div className={style.menuBar}>
        <VscChromeMinimize onClick={handleMinimize} className={style.icon} />
        <IoCloseOutline onClick={handleClose} className={style.icon} />
      </div>
    </div>
  );
}