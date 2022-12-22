let ws
const input = document.querySelector('input');
const button = document.querySelector('button');
const chatWindow = document.querySelector('.chat-window')
let userName


function receiveMessage(msg){
    const message = JSON.parse(msg);
    addMessage(message.value,"receiver",message.name);
}

function sendMessage(){
    if(input.value == '')
        return;
    ws.send(JSON.stringify({type: "data",value: `${input.value}`,name: `${userName}`}))
    addMessage(input.value,"sender")
    input.value = "";
}

function addMessage(data,messageType,messenger = null){
    const message = document.createElement('p');
    message.classList.add("message");
    if(messageType == "receiver"){
        message.classList.add("receiver");
        message.textContent += messenger + ": ";
    }
    message.textContent += data;
    chatWindow.appendChild(message);
}

window.onload = () => {
    do{
        userName = prompt("Enter Username:")
    }
    while(userName == null || userName == "");
    if(userName){
        initialise()
    }
}

function initialise(){
    console.log(userName)
    // ws = new WebSocket("ws://localhost:8001/");
    ws = new WebSocket("wss://pbl-socketserver.onrender.com/");
    ws.addEventListener("open",()=>{
        const event = {type: "connection",value:"ok",name:`${userName}`};
        ws.send(JSON.stringify(event));
    })
    button.addEventListener("click",sendMessage);
    document.addEventListener("keydown",(e)=>{
        if(e.key == 'Enter' && document.activeElement == input){
            sendMessage();
        }
    })
    ws.addEventListener("message",({data})=>{receiveMessage(data);})
    input.value = "";
}