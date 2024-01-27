const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    // 전송 전 데이터 검증 가능
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    // 렌더러 프로세스에서 전달된 이벤트 수신
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});