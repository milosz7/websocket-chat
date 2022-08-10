import {
  displayClassname,
  messageAuthorClassname,
  messageBaseClassname,
  messageContentClassname,
  minUsernameLength,
  recievedMessageClassname,
  selfMessageClassname,
  API_URL
} from './constants.js';

const welcomeForm = document.getElementById('welcome-form')!;
const messageBox = document.getElementById('messages-section')!;
const messageList = document.getElementById('messages-list')!;
const messageForm = document.getElementById('add-messages-form')!;
const messageInput = document.getElementById('message-content') as HTMLInputElement;
const usernameInput = document.getElementById('username') as HTMLInputElement;
const validationError = document.querySelector('.validation-error')!;

let userName = '';

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

const sendMessage = async (author: string, message: string) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({author, message})
  }
  const response = await fetch(API_URL, options)
  console.log(response)
} 

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
  if (messageContent) {
    sendMessage(messageAuthor, messageContent)
    addMessage(messageAuthor, messageContent);
  }
});
