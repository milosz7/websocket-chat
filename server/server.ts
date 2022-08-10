import express from 'express';
import path from 'path';

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
    console.log(messages);
  }
});

app.listen(8000, () => {
  console.log('listening on port 8000');
});
