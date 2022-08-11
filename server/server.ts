import express from 'express';
import path from 'path';
import { Server } from 'socket.io';

interface messageData {
  author: string;
  message: string;
}

interface userData {
  user: string;
  id: string;
}

const messages: messageData[] = [];
const userData: userData[] = [];

const app = express();
app.use(express.json())

app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const server = app.listen(8000, () => {
  console.log('port 8000')
})
const io = new Server(server);  

io.on('connection', (socket) => {
  socket.on('message', (message: messageData) => {
    messages.push(message);
    socket.broadcast.emit("message", message);
  });
  socket.on('login', (user: string) => {
    userData.push({user, id: socket.id})
  })
  socket.on('disconnect', () => {
    const userToLogoutIdx = userData.findIndex(user => user.id !== socket.id)
    userData.splice(userToLogoutIdx, 1);
  });
});
