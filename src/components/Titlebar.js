import React from 'react';
import { VscChromeMinimize } from "react-icons/vsc";
import { IoCloseOutline } from "react-icons/io5";
import Swal from 'sweetalert2';

const { ipcRenderer } = window.require('electron');

const styles = {
  titleBar: {
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    WebkitAppRegion: 'drag',
  },
  menuBar: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  icon: {
    padding: '7px',
    fontSize: '20px',
    '-webkit-app-region': 'no-drag'
  },
  lightLogo: {
    fontSize: '30px',
    padding: '5px',
    color: '#000000',
    textShadow: '1px 1px 1px #fff',
    fontFamily: 'SUIT-Regular',
    fontWeight: 'bolder',
  },
  logoContainer: {
    marginRight: 'auto'
  }
}

export default function Titlebar() {
  const handleMinimize = () => {
    ipcRenderer.send('MINIMIZE');
  };

  const handleClose = () => {
    ipcRenderer.send('CLOSE');
  };

  return (
    <div style={styles.titleBar}>
      <div style={styles.logoContainer}>
        <span style={styles.lightLogo}>Alpha</span>
        <span style={{ fontSize: '20px' }}>Chat</span>
      </div>
      <div style={styles.menuBar}>
        <VscChromeMinimize onClick={handleMinimize} style={styles.icon} />
        <IoCloseOutline onClick={handleClose} style={styles.icon} />
      </div>
    </div>
  );
}