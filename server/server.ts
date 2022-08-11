import express from 'express';
import path from 'path';
import { Server } from 'socket.io';

interface messageData {
  author: string;
  message: string;
}

const messages: messageData[] = [];

const app = express();
app.use(express.json())

app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.post('/api', (req, res, next) => {
  const messageData = req.body as messageData;
  const { author, message } = messageData;
  if (author && message) {
    messages.push(messageData);
  }
});

const server = app.listen(8000, () => {
  console.log('port 8000')
})
const io = new Server(server);  

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', (message: messageData) => {
    messages.push(message);
    socket.broadcast.emit("message", message);
  });
  socket.on('disconnect', () => { console.log('Oh, socket ' + socket.id + ' has left') });
});
