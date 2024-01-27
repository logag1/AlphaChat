import { app, BrowserWindow, ipcMain, Menu, webContents } from 'electron';
import path from 'path';
import fs from 'fs';
import Swal from 'sweetalert2';

let mainWindow: BrowserWindow | null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    maximizable: false,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '../lib/preload.js'),
      contextIsolation: false
    },
    icon: path.join(__dirname, '../public/logo.png')
  });

  Menu.setApplicationMenu(null);
  mainWindow.setOverlayIcon(null, '');
  mainWindow.loadURL('http://localhost:3000');
  console.log(path.join(__dirname, '../build/index.html'))
  //mainWindow.loadFile(path.join(__dirname, '../build/index.html'));

  ipcMain.on('MINIMIZE', (evt) => {
    mainWindow!.minimize();
  });

  ipcMain.on('CLOSE', (evt) => {
    mainWindow!.close();
  });

  ipcMain.on('ALERT', (evt, message) => {
    Swal.fire({
      title: message,
      toast: true,
      position: 'bottom-end',
      customClass: {
        popup: 'colored-toast',
      },
      showConfirmButton: false,
      timer: 2000
    });
  });

  ipcMain.on('LOGOUT', (evt) => {
    fs.writeFileSync(path.join(__dirname, '../config.json'), JSON.stringify({
      token: ''
    }));
  });

  ipcMain.on('SAVE_TOKEN', (evt, token) => {
    fs.writeFileSync(path.join(__dirname, '../config.json'), JSON.stringify({
      token: token
    }));
  });

  ipcMain.on('REQ_TOKEN', (evt) => {
    const readRes = fs.readFileSync(path.join(__dirname, '../config.json'), 'utf-8');
    const token = JSON.parse(readRes).token;
    evt.sender.send('TOKEN_RES', token);
  });

  ipcMain.on('SAVE_MSG', (evt, chat) => {
    const json = JSON.parse(fs.readFileSync(path.join(__dirname, '../msg.json'), 'utf-8'));
    json[chat.chatId] = chat;
    fs.writeFileSync(path.join(__dirname, '../msg.json'), JSON.stringify(json, null, 2), 'utf8');
  });

  ipcMain.on('GET_CHATLIST', (evt, userId) => {
    const readRes = fs.readFileSync(path.join(__dirname, '../msg.json'), 'utf-8');
    const chats = JSON.parse(readRes);
    const filterRes = Object.values(chats).filter((chat: any) => chat.userId === userId);
    evt.sender.send('CHATLIST', filterRes);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});