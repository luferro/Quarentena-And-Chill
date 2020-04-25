const socket = io();
const messageContainer = document.getElementById('chat-messages');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message');
const userslist = document.getElementById("users_list");
const chat = document.getElementById("chat");
const assistir = document.getElementById("assistir");
const canvas = document.getElementById("canvas");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const name = urlParams.get('name');
const redirect = urlParams.has('name');

if(chat != null)
    chat.href = "/chat.html?name="+name;
if(assistir != null)
    assistir.href = "/assistir.html?name="+name;
if(canvas != null)
    canvas.href = "/canvas.html?name="+name;
if(redirect === false || name === "null" || name === ""){
    window.location = "https://quarentena-chill.herokuapp.com";
}

appendMessageLigacoes("Tu", " estás ligado.");
socket.emit('new-user', name);

socket.on('chat-message', message => {
    outputMessageOutros(message);  
    messageContainer.scrollTop = messageContainer.scrollHeight;
})

socket.on('users-list', users => {
    console.log("users");
    outputUsers(users);
    outputUsers(users.name);
  });

socket.on('user-connected', name => {
    console.log(name +" ligou.");
})

socket.on('user-disconnected', name => {
    console.log(name +" desligou.");
})

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    outputMessageEu(message);
    socket.emit('send-chat-message', message);
    messageInput.value = ' ';
    messageContainer.scrollTop = messageContainer.scrollHeight;
})

function outputMessageOutros(message) {
    const div = document.createElement('div');
    div.classList.add('msg');
    div.innerHTML = `<b><i>${message.name}></i></b>
    <p>${message.message}</p>`;
    messageContainer.appendChild(div);
}

function outputMessageEu(message) {
    const div = document.createElement('div');
    div.classList.add('msg');
    div.innerHTML = `<b><i>Eu></i></b>
    <p>${message}</p>`;
    messageContainer.appendChild(div);
}

function appendMessageLigacoes(who, message) {
    const div = document.createElement('div');
    div.classList.add('msg');
    div.innerHTML = `<p>${who} ${message}</p>`;
    messageContainer.appendChild(div);
}

function outputUsers(users) {
    console.log(users);
    console.log(users.name);
    userslist.innerHTML = `<li>${users}</li>`;
  }