const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const serialport = require('serialport');
const { promisify } = require('util');
const readFileAsync = promisify(require("fs").readFile);
const serialController = require('./controllers/serialController');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('a user connected');
});

const start = async () => {
  try {
    const port = await readFileAsync(path.join(__dirname, 'config.txt'), 'utf8');
    const parser = new serialport.parsers.Readline();
    const serialConnection = new serialport(port.trim(), { baudRate: 115200 });
    serialConnection.pipe(parser);

    parser.on('data', async function(data) {
      await serialController.handleSerialData(io, data);
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

start();

io.on('disconnect', () => {
  console.log('user disconnected');
});
