// ***********************************
//  ＜実行方法＞
//  このディレクトリにcdして
//  > electron .\
//  で起動する．
'use strict'

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
//const path = require('path');
const url = require('url');
const process = require('process');

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 960, height: 640})
  mainWindow.loadURL(url.resolve('file://', 'index.html'));
  //mainWindow.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

