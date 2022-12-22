const ws = new WebSocket("wss://pbl-socketserver.onrender.com/");
const input = document.querySelector('input');
const button = document.querySelector('button');
const chatWindow = document.querySelector('.chat-window')
// const sender = document.getElementById("sender");
// const receiver = document.getElementById("receiver");


button.addEventListener("click",sendMessage);
document.addEventListener("keydown",(e)=>{
    if(e.key == 'Enter' && document.activeElement == input){
        sendMessage();
    }
})
ws.addEventListener("message",({data})=>{
    addMessage(data,"receiver");
})

function sendMessage(){
    if(input.value == '')
        return;
    ws.send(JSON.stringify({type: "data",value: `${input.value}`}))
    addMessage(input.value,"sender")
    input.value = "";
}

function addMessage(data,messageType){
    const message = document.createElement('p');
    message.classList.add("message");
    message.textContent = data;
    if(messageType == "receiver")
        message.classList.add("receiver");
    chatWindow.appendChild(message);
}

window.onload = () => {
    ws.addEventListener("open",()=>{
        const event = {type: "connection",value:"ok"};
        ws.send(JSON.stringify(event));
    })
    input.value = "";
}