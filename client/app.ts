declare const io: any;
import {
  displayClassname,
  messageAuthorClassname,
  messageBaseClassname,
  messageContentClassname,
  minUsernameLength,
  recievedMessageClassname,
  selfMessageClassname,
  API_URL,
} from './constants.js';

const welcomeForm = document.getElementById('welcome-form')!;
const messageBox = document.getElementById('messages-section')!;
const messageList = document.getElementById('messages-list')!;
const messageForm = document.getElementById('add-messages-form')!;
const messageInput = document.getElementById('message-content') as HTMLInputElement;
const usernameInput = document.getElementById('username') as HTMLInputElement;
const validationError = document.querySelector('.validation-error')!;
const messageError = document.querySelector('.message-error')!;

let userName = '';

const socket = io({
  autoConnect: true,
});
socket.on('message', ({ author, message }: { author: string; message: string }) =>
  addMessage(author, message)
);

const validateUsername = () => {
  const passedUsername = usernameInput.value;
  if (passedUsername.length >= minUsernameLength) {
    userName = passedUsername;
    if (validationError.classList.contains(displayClassname)) {
      validationError.classList.toggle(displayClassname);
    }
    return true;
  }
  if (!validationError.classList.contains(displayClassname)) {
    validationError.classList.toggle(displayClassname);
  }
  return false;
};

const addMessage = (author: string, message: string) => {
  const messageOriginClassname =
    author === userName ? selfMessageClassname : recievedMessageClassname;
  const messageListItem = document.createElement('li');
  messageListItem.classList.add(messageBaseClassname, messageOriginClassname);

  const messageAuthor = document.createElement('h3');
  messageAuthor.classList.add(messageAuthorClassname);
  messageAuthor.appendChild(document.createTextNode(userName === author ? 'You' : author));

  const messageContent = document.createElement('div');
  messageContent.appendChild(document.createTextNode(message));
  messageContent.classList.add(messageContentClassname);

  messageListItem.appendChild(messageAuthor);
  messageListItem.appendChild(messageContent);
  messageList.appendChild(messageListItem);

  messageInput.value = '';
};

const sendMessage = (author: string, message: string) => {
  socket.emit('message', { author, message });
};

const manageMessageError = (message: string) => {
  if (!message) {
    messageError.classList.add(displayClassname);
  }
  if (message && messageError.classList.contains(displayClassname)) {
    messageError.classList.remove(displayClassname);
  }
};

welcomeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const isUsernameCorrect = validateUsername();
  if (isUsernameCorrect) {
    welcomeForm.classList.remove(displayClassname);
    messageBox.classList.add(displayClassname);
  }
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const messageAuthor = userName;
  const messageContent = messageInput.value;
  manageMessageError(messageContent);
  if (messageContent) {
    sendMessage(messageAuthor, messageContent);
    addMessage(messageAuthor, messageContent);
  }
});
